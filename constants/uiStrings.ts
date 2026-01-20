import { FilterState, Language } from '../types';

export interface UIStrings {
  title: string;
  placeholder: string;
  search: string;
  filters: string;
  apply: string;
  clear: string;
  loading: string;
  mapResults: string;
  viewOnMap: string;
  emptyMap: string;
  global: string;
  closeResults: string;
  manualAreaLabel: string;
  manualAreaPlaceholder: string;
  orDivider: string;
  regionLabel: string;
  districtLabel: string;
  locError: string;
  selectedRestaurant: string;
  openInGoogleMaps: string;
}

export const UI_STRINGS: Record<Language, UIStrings> = {
  zh: {
    title: "搵食",
    placeholder: "你想搵咩餐廳？(例如: 壽司, 漢堡包)",
    search: "搜尋",
    filters: "篩選條件",
    apply: "搜尋餐廳",
    clear: "重設所有",
    loading: "搜尋緊相關餐廳...",
    mapResults: "搜尋結果",
    viewOnMap: "地圖定位",
    emptyMap: "未搵到相關地點",
    global: "環球版",
    closeResults: "隱藏結果",
    manualAreaLabel: "手動輸入地區 (自定義)",
    manualAreaPlaceholder: "例如: 啟德, 西九文化區",
    orDivider: "或使用預設地區",
    regionLabel: "區域",
    districtLabel: "地區",
    locError: "無法獲取您的位置，請檢查權限。",
    selectedRestaurant: "已選擇餐廳",
    openInGoogleMaps: "喺 Google Maps 開啟"
  },
  en: {
    title: "Gourmet Finder",
    placeholder: "What are you looking for? (e.g. Sushi, Burgers)",
    search: "Search",
    filters: "Filters",
    apply: "Search Restaurants",
    clear: "Clear All",
    loading: "Searching for restaurants...",
    mapResults: "Search Results",
    viewOnMap: "Focus on Map",
    emptyMap: "No relevant places found",
    global: "Global",
    closeResults: "Hide Results",
    manualAreaLabel: "Custom Area Input",
    manualAreaPlaceholder: "e.g. Kai Tak, West Kowloon",
    orDivider: "OR select from list",
    regionLabel: "Region",
    districtLabel: "District",
    locError: "Cannot get your location. Please check permissions.",
    selectedRestaurant: "Selected Restaurant",
    openInGoogleMaps: "Open in Google Maps"
  }
};

export const INITIAL_FILTERS: FilterState = {
  country: '香港',
  city: '香港島',
  district: '全部地區',
  cuisine: '全部菜式'
};

export const DEFAULT_MAP_URL = 'https://www.google.com/maps?q=Hong+Kong+Island&output=embed';
