import { FilterState, PlaceResult, Language } from '../types';

// Location coordinates for cities
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  '香港島': { lat: 22.2783, lng: 114.1747 },
  '九龍': { lat: 22.3193, lng: 114.1694 },
  '新界': { lat: 22.4445, lng: 114.0227 },
  '離島': { lat: 22.2614, lng: 113.9456 },
  '東京': { lat: 35.6762, lng: 139.6503 },
  '大阪': { lat: 34.6937, lng: 135.5023 },
  '京都': { lat: 35.0116, lng: 135.7681 },
  '福岡': { lat: 33.5904, lng: 130.4017 },
  '北海道': { lat: 43.0642, lng: 141.3469 },
  '倫敦': { lat: 51.5074, lng: -0.1278 },
  '曼徹斯特': { lat: 53.4808, lng: -2.2426 },
  '愛丁堡': { lat: 55.9533, lng: -3.1883 },
  '伯明翰': { lat: 52.4862, lng: -1.8904 }
};

// Cuisine type mapping for Google Places
const CUISINE_KEYWORDS: Record<string, string> = {
  '全部菜式': 'restaurant',
  '港式': 'hong kong style restaurant',
  '日本菜': 'japanese restaurant',
  '泰國菜': 'thai restaurant',
  '韓國菜': 'korean restaurant',
  '西餐': 'western restaurant',
  '意大利菜': 'italian restaurant',
  '台灣菜': 'taiwanese restaurant',
  '火鍋': 'hot pot restaurant',
  '甜品': 'dessert cafe',
  '茶餐廳': 'cha chaan teng',
  '四川菜': 'sichuan restaurant',
  '順德菜': 'cantonese restaurant',
  '星馬菜': 'malaysian singaporean restaurant',
  '法國菜': 'french restaurant'
};

let placesService: google.maps.places.PlacesService | null = null;
let autocompleteService: google.maps.places.AutocompleteService | null = null;

export const initPlacesService = (map: google.maps.Map) => {
  placesService = new google.maps.places.PlacesService(map);
  autocompleteService = new google.maps.places.AutocompleteService();
};

export const getPlacesService = () => placesService;

export const getCityCoordinates = (city: string): { lat: number; lng: number } => {
  return CITY_COORDINATES[city] || CITY_COORDINATES['香港島'];
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

  const districtTerm = filters.district === '全部地區' ? '' : filters.district;
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
      fields: ['name', 'formatted_address', 'rating', 'user_ratings_total', 'price_level', 'photos', 'geometry', 'opening_hours', 'types', 'place_id']
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
          types: place.types
        });
      } else {
        resolve(null);
      }
    });
  });
};
