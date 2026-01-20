import { FilterState, PlaceResult, Language } from '../types';

// Location coordinates for cities (using English keys)
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'Hong Kong Island': { lat: 22.2783, lng: 114.1747 },
  'Kowloon': { lat: 22.3193, lng: 114.1694 },
  'New Territories': { lat: 22.4445, lng: 114.0227 },
  'Outlying Islands': { lat: 22.2614, lng: 113.9456 },
  'Tokyo': { lat: 35.6762, lng: 139.6503 },
  'Osaka': { lat: 34.6937, lng: 135.5023 },
  'Kyoto': { lat: 35.0116, lng: 135.7681 },
  'Fukuoka': { lat: 33.5904, lng: 130.4017 },
  'Hokkaido': { lat: 43.0642, lng: 141.3469 },
  'London': { lat: 51.5074, lng: -0.1278 },
  'Manchester': { lat: 53.4808, lng: -2.2426 },
  'Edinburgh': { lat: 55.9533, lng: -3.1883 },
  'Birmingham': { lat: 52.4862, lng: -1.8904 }
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
  return CITY_COORDINATES[city] || CITY_COORDINATES['Hong Kong Island'];
};

export const searchPlaces = async (
  query: string,
  filters: FilterState,
  lang: Language
): Promise<PlaceResult[]> => {
  if (!placesService) {
    throw new Error(lang === 'zh' ? '地圖服務未準備好' : 'Map service not ready');
  }

  const cityCoords = getCityCoordinates(filters.city);
  const cuisineKeyword = CUISINE_KEYWORDS[filters.cuisine] || 'restaurant';

  const districtTerm = filters.district === 'All Districts' ? '' : filters.district;
  const searchQuery = [query, cuisineKeyword, districtTerm, filters.city].filter(Boolean).join(' ');

  return new Promise((resolve, reject) => {
    const request: google.maps.places.TextSearchRequest = {
      query: searchQuery,
      location: new google.maps.LatLng(cityCoords.lat, cityCoords.lng),
      radius: 10000,
      type: 'restaurant'
    };

    placesService!.textSearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        const places: PlaceResult[] = results.slice(0, 15).map(place => ({
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
        resolve(places);
      } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        resolve([]);
      } else {
        reject(new Error(lang === 'zh' ? '搜尋發生錯誤' : 'Search error'));
      }
    });
  });
};

export const getPlaceDetails = async (
  placeId: string,
  lang: Language
): Promise<PlaceResult | null> => {
  if (!placesService) {
    throw new Error(lang === 'zh' ? '地圖服務未準備好' : 'Map service not ready');
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
