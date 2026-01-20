
export type Language = 'zh' | 'en';
export type Theme = 'light' | 'dark';

export interface FilterState {
  country: string;
  city: string;
  district: string;
  cuisine: string;
}

export interface LocalizedItem {
  id?: string;
  zh: string;
  en: string;
}

export interface GroundingChunk {
  maps?: {
    uri: string;
    title: string;
  };
}

export interface SearchResult {
  text: string;
  sources: { title: string; url: string }[];
}

export interface PlaceResult {
  placeId: string;
  name: string;
  address: string;
  rating?: number;
  userRatingsTotal?: number;
  priceLevel?: number;
  photoUrl?: string;
  location: {
    lat: number;
    lng: number;
  };
  openNow?: boolean;
  types?: string[];
}
