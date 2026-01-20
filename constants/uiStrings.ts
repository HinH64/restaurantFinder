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
  ratingLabel: string;
  aiSummary: string;
  aiSummaryLoading: string;
  aiSummaryError: string;
  highlights: string;
  disadvantages: string;
  popularDishes: string;
  generateSummary: string;
  website: string;
  reserve: string;
  orderOnline: string;
  call: string;
  directions: string;
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
    openInGoogleMaps: "喺 Google Maps 開啟",
    ratingLabel: "最低評分",
    aiSummary: "AI 評論摘要",
    aiSummaryLoading: "AI 正在分析評論...",
    aiSummaryError: "無法獲取摘要",
    highlights: "正面評價",
    disadvantages: "需改善之處",
    popularDishes: "推薦菜式",
    generateSummary: "AI 摘要",
    website: "官方網站",
    reserve: "訂位",
    orderOnline: "線上點餐",
    call: "致電",
    directions: "路線"
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
    openInGoogleMaps: "Open in Google Maps",
    ratingLabel: "Min Rating",
    aiSummary: "AI Review Summary",
    aiSummaryLoading: "AI analyzing reviews...",
    aiSummaryError: "Unable to get summary",
    highlights: "Positive Reviews",
    disadvantages: "Areas to Improve",
    popularDishes: "Popular Dishes",
    generateSummary: "AI Summary",
    website: "Website",
    reserve: "Reserve",
    orderOnline: "Order Online",
    call: "Call",
    directions: "Directions"
  }
};

export const INITIAL_FILTERS: FilterState = {
  country: 'Hong Kong',
  city: 'Hong Kong Island',
  district: 'All Districts',
  cuisine: 'All Cuisines',
  minRating: '0'
};

export const RATING_OPTIONS = [
  { zh: '全部', en: 'All', value: '0' },
  { zh: '3.0+', en: '3.0+', value: '3' },
  { zh: '3.5+', en: '3.5+', value: '3.5' },
  { zh: '4.0+', en: '4.0+', value: '4' },
  { zh: '4.5+', en: '4.5+', value: '4.5' }
];

export const DEFAULT_MAP_URL = 'https://www.google.com/maps?q=Hong+Kong+Island&output=embed';
