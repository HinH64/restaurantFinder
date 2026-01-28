import { FilterState, PlaceResult, Language } from '../types';
import { getLocalizedText } from '../utils/localize';

// Location coordinates and bounding box for cities (using English keys)
// For Hong Kong, we use lat boundaries since regions are separated by Victoria Harbour
interface CityConfig {
  lat: number;
  lng: number;
  maxDistance: number; // km - fallback for distance filtering
  // Optional bounding box for more precise filtering (especially for HK regions)
  bounds?: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
}

const CITY_CONFIG: Record<string, CityConfig> = {
  // Hong Kong regions - use bounding boxes to separate by Victoria Harbour
  'Hong Kong Island': {
    lat: 22.2783, lng: 114.1747, maxDistance: 10,
    bounds: { minLat: 22.19, maxLat: 22.30, minLng: 114.10, maxLng: 114.27 }
  },
  'Kowloon': {
    lat: 22.3193, lng: 114.1694, maxDistance: 8,
    bounds: { minLat: 22.29, maxLat: 22.37, minLng: 114.14, maxLng: 114.23 }
  },
  'New Territories': {
    lat: 22.4445, lng: 114.0227, maxDistance: 20,
    bounds: { minLat: 22.37, maxLat: 22.56, minLng: 113.82, maxLng: 114.43 }
  },
  'Outlying Islands': {
    lat: 22.2614, lng: 113.9456, maxDistance: 25,
    bounds: { minLat: 22.15, maxLat: 22.35, minLng: 113.82, maxLng: 114.10 }
  },
  // Japan cities/prefectures - use distance filtering
  'Tokyo': { lat: 35.6762, lng: 139.6503, maxDistance: 25 },
  'Osaka': { lat: 34.6937, lng: 135.5023, maxDistance: 20 },
  'Kyoto': { lat: 35.0116, lng: 135.7681, maxDistance: 15 },
  'Fukuoka': { lat: 33.5904, lng: 130.4017, maxDistance: 15 },
  'Hokkaido': { lat: 43.0642, lng: 141.3469, maxDistance: 30 },
  // UK cities - use distance filtering
  'London': { lat: 51.5074, lng: -0.1278, maxDistance: 20 },
  'Manchester': { lat: 53.4808, lng: -2.2426, maxDistance: 15 },
  'Edinburgh': { lat: 55.9533, lng: -3.1883, maxDistance: 15 },
  'Birmingham': { lat: 52.4862, lng: -1.8904, maxDistance: 15 }
};

// Calculate distance between two coordinates using Haversine formula (returns km)
const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Cuisine type mapping for Google Places (using English keys)
const CUISINE_KEYWORDS: Record<string, string> = {
  'All Cuisines': 'restaurant',
  'Hong Kong Style': 'hong kong style restaurant',
  'Japanese': 'japanese restaurant',
  'Thai': 'thai restaurant',
  'Korean': 'korean restaurant',
  'Western': 'western restaurant',
  'Italian': 'italian restaurant',
  'Taiwanese': 'taiwanese restaurant',
  'Hot Pot': 'hot pot restaurant',
  'Dessert': 'dessert cafe',
  'Cha Chaan Teng': 'cha chaan teng',
  'Sichuan': 'sichuan restaurant',
  'Shunde': 'cantonese restaurant',
  'Singaporean/Malaysian': 'malaysian singaporean restaurant',
  'French': 'french restaurant'
};

let placesService: google.maps.places.PlacesService | null = null;
let autocompleteService: google.maps.places.AutocompleteService | null = null;

export const initPlacesService = (map: google.maps.Map) => {
  placesService = new google.maps.places.PlacesService(map);
  autocompleteService = new google.maps.places.AutocompleteService();
};

export const getPlacesService = () => placesService;

export const getCityCoordinates = (city: string): { lat: number; lng: number } => {
  const config = CITY_CONFIG[city] || CITY_CONFIG['Hong Kong Island'];
  return { lat: config.lat, lng: config.lng };
};

const getCityConfig = (city: string): CityConfig => {
  return CITY_CONFIG[city] || CITY_CONFIG['Hong Kong Island'];
};

export const searchPlaces = async (
  query: string,
  filters: FilterState,
  lang: Language
): Promise<PlaceResult[]> => {
  if (!placesService) {
    throw new Error(getLocalizedText({
      zh: '地圖服務未準備好',
      en: 'Map service not ready',
      ja: 'マップサービスの準備ができていません'
    }, lang));
  }

  const cityConfig = getCityConfig(filters.city);
  const cuisineKeyword = CUISINE_KEYWORDS[filters.cuisine] || 'restaurant';

  const districtTerm = filters.district === 'All Districts' ? '' : filters.district;

  // Build additional keywords for detailed filters
  const additionalKeywords: string[] = [];

  // Accessibility filters
  if (filters.accessibleEntrance) {
    additionalKeywords.push('wheelchair accessible entrance');
  }
  if (filters.accessibleSeating) {
    additionalKeywords.push('wheelchair accessible seating');
  }
  if (filters.accessibleParking) {
    additionalKeywords.push('accessible parking');
  }

  // Children filters
  if (filters.changingTable) {
    additionalKeywords.push('changing table');
  }
  if (filters.highChair) {
    additionalKeywords.push('high chair');
  }
  if (filters.kidsMenu) {
    additionalKeywords.push('kids menu family friendly');
  }

  // Pet filters
  if (filters.dogsAllowed) {
    additionalKeywords.push('dogs allowed');
  }
  if (filters.dogsOutdoorOnly) {
    additionalKeywords.push('dogs allowed outdoor');
  }
  if (filters.dogFriendlyAccommodation) {
    additionalKeywords.push('pet friendly dog friendly');
  }

  const searchQuery = [query, cuisineKeyword, districtTerm, filters.city, ...additionalKeywords].filter(Boolean).join(' ');

  return new Promise((resolve, reject) => {
    const request: google.maps.places.TextSearchRequest = {
      query: searchQuery,
      location: new google.maps.LatLng(cityConfig.lat, cityConfig.lng),
      radius: cityConfig.maxDistance * 1000, // Convert km to meters
      type: 'restaurant'
    };

    placesService!.textSearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        // Map results to PlaceResult format
        const allPlaces: PlaceResult[] = results.map(place => ({
          placeId: place.place_id || '',
          name: place.name || '',
          address: place.formatted_address || '',
          rating: place.rating,
          userRatingsTotal: place.user_ratings_total,
          priceLevel: place.price_level,
          photoUrl: place.photos?.[0]?.getUrl({ maxWidth: 400, maxHeight: 300 }),
          location: {
            lat: place.geometry?.location?.lat() || 0,
            lng: place.geometry?.location?.lng() || 0
          },
          openNow: place.opening_hours?.isOpen?.(),
          types: place.types
        }));

        // Filter results by bounding box (if available) or distance
        let filteredPlaces = allPlaces.filter(place => {
          // Use bounding box for precise filtering (especially for HK regions)
          if (cityConfig.bounds) {
            const { minLat, maxLat, minLng, maxLng } = cityConfig.bounds;
            return (
              place.location.lat >= minLat &&
              place.location.lat <= maxLat &&
              place.location.lng >= minLng &&
              place.location.lng <= maxLng
            );
          }
          // Fallback to distance filtering
          const distance = calculateDistance(
            cityConfig.lat,
            cityConfig.lng,
            place.location.lat,
            place.location.lng
          );
          return distance <= cityConfig.maxDistance;
        });

        // Apply price level filter
        const priceFilter = parseInt(filters.priceLevel) || 0;
        if (priceFilter > 0) {
          filteredPlaces = filteredPlaces.filter(place =>
            place.priceLevel !== undefined && place.priceLevel === priceFilter
          );
        }

        // Return up to 15 results
        resolve(filteredPlaces.slice(0, 15));
      } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        resolve([]);
      } else {
        reject(new Error(getLocalizedText({
          zh: '搜尋發生錯誤',
          en: 'Search error',
          ja: '検索エラー'
        }, lang)));
      }
    });
  });
};

export const getPlaceDetails = async (
  placeId: string,
  lang: Language
): Promise<PlaceResult | null> => {
  if (!placesService) {
    throw new Error(getLocalizedText({
      zh: '地圖服務未準備好',
      en: 'Map service not ready',
      ja: 'マップサービスの準備ができていません'
    }, lang));
  }

  return new Promise((resolve, reject) => {
    const request: google.maps.places.PlaceDetailsRequest = {
      placeId,
      fields: [
        'name',
        'formatted_address',
        'rating',
        'user_ratings_total',
        'price_level',
        'photos',
        'geometry',
        'opening_hours',
        'types',
        'place_id',
        'website',
        'url',
        'formatted_phone_number'
      ]
    };

    placesService!.getDetails(request, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place) {
        resolve({
          placeId: place.place_id || '',
          name: place.name || '',
          address: place.formatted_address || '',
          rating: place.rating,
          userRatingsTotal: place.user_ratings_total,
          priceLevel: place.price_level,
          photoUrl: place.photos?.[0]?.getUrl({ maxWidth: 400, maxHeight: 300 }),
          location: {
            lat: place.geometry?.location?.lat() || 0,
            lng: place.geometry?.location?.lng() || 0
          },
          openNow: place.opening_hours?.isOpen?.(),
          types: place.types,
          website: place.website,
          googleMapsUrl: place.url,
          phoneNumber: place.formatted_phone_number
        });
      } else {
        resolve(null);
      }
    });
  });
};
