
export type Language = 'zh' | 'en' | 'ja';
export type Theme = 'light' | 'dark';

export interface FilterState {
  country: string;
  city: string;
  district: string;
  cuisine: string;
  minRating: string;
  priceLevel: string;
  // Accessibility options
  accessibleEntrance: boolean;
  accessibleSeating: boolean;
  accessibleParking: boolean;
  // Children options
  changingTable: boolean;
  highChair: boolean;
  kidsMenu: boolean;
  // Pet options
  dogsAllowed: boolean;
  dogsOutdoorOnly: boolean;
  dogFriendlyAccommodation: boolean;
}

export interface LocalizedItem {
  id?: string;
  zh: string;
  en: string;
  ja: string;
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
  website?: string;
  googleMapsUrl?: string;
  phoneNumber?: string;
}
