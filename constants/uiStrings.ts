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
  priceLevelLabel: string;
  accessibilityLabel: string;
  childFriendlyLabel: string;
  petFriendlyLabel: string;
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
  findOnMap: string;
  aiSearchPlaceholder: string;
  aiSearchButton: string;
  aiSearchLoading: string;
  useFilters: string;
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
    priceLevelLabel: "價格範圍",
    accessibilityLabel: "無障礙設施",
    childFriendlyLabel: "適合兒童",
    petFriendlyLabel: "寵物友善",
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
    directions: "路線",
    findOnMap: "地圖定位",
    aiSearchPlaceholder: "AI 搜尋 (例如: 2026年新開業餐廳)",
    aiSearchButton: "AI 搜尋",
    aiSearchLoading: "AI 正在搜尋...",
    useFilters: "套用篩選條件"
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
    priceLevelLabel: "Price Range",
    accessibilityLabel: "Accessibility",
    childFriendlyLabel: "Child Friendly",
    petFriendlyLabel: "Pet Friendly",
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
    directions: "Directions",
    findOnMap: "Find on Map",
    aiSearchPlaceholder: "AI Search (e.g. new restaurants opened in 2026)",
    aiSearchButton: "AI Search",
    aiSearchLoading: "AI is searching...",
    useFilters: "Use Filters"
  },
  ja: {
    title: "グルメ検索",
    placeholder: "何をお探しですか？（例：寿司、ハンバーガー）",
    search: "検索",
    filters: "フィルター",
    apply: "レストラン検索",
    clear: "クリア",
    loading: "レストランを検索中...",
    mapResults: "検索結果",
    viewOnMap: "地図で見る",
    emptyMap: "該当する場所が見つかりません",
    global: "グローバル",
    closeResults: "結果を隠す",
    manualAreaLabel: "エリアを入力（カスタム）",
    manualAreaPlaceholder: "例：渋谷、新宿",
    orDivider: "またはリストから選択",
    regionLabel: "地域",
    districtLabel: "エリア",
    locError: "位置情報を取得できません。権限を確認してください。",
    selectedRestaurant: "選択中のレストラン",
    openInGoogleMaps: "Google Mapsで開く",
    ratingLabel: "最低評価",
    priceLevelLabel: "価格帯",
    accessibilityLabel: "バリアフリー",
    childFriendlyLabel: "子供向け",
    petFriendlyLabel: "ペット可",
    aiSummary: "AIレビュー要約",
    aiSummaryLoading: "AIがレビューを分析中...",
    aiSummaryError: "要約を取得できません",
    highlights: "良い点",
    disadvantages: "改善点",
    popularDishes: "人気メニュー",
    generateSummary: "AI要約",
    website: "ウェブサイト",
    reserve: "予約",
    orderOnline: "オンライン注文",
    call: "電話",
    directions: "経路",
    findOnMap: "地図で見る",
    aiSearchPlaceholder: "AI検索（例：2026年にオープンした新しいレストラン）",
    aiSearchButton: "AI検索",
    aiSearchLoading: "AIが検索中...",
    useFilters: "フィルターを使用"
  }
};

export const INITIAL_FILTERS: FilterState = {
  country: 'Hong Kong',
  city: 'Hong Kong Island',
  district: 'All Districts',
  cuisine: 'All Cuisines',
  minRating: '0',
  priceLevel: '0',
  // Accessibility options
  accessibleEntrance: false,
  accessibleSeating: false,
  accessibleParking: false,
  // Children options
  changingTable: false,
  highChair: false,
  kidsMenu: false,
  // Pet options
  dogsAllowed: false,
  dogsOutdoorOnly: false,
  dogFriendlyAccommodation: false
};

export const RATING_OPTIONS = [
  { zh: '全部', en: 'All', ja: 'すべて', value: '0' },
  { zh: '3.0+', en: '3.0+', ja: '3.0+', value: '3' },
  { zh: '3.5+', en: '3.5+', ja: '3.5+', value: '3.5' },
  { zh: '4.0+', en: '4.0+', ja: '4.0+', value: '4' },
  { zh: '4.5+', en: '4.5+', ja: '4.5+', value: '4.5' }
];

export const PRICE_LEVEL_OPTIONS = [
  { zh: '全部', en: 'All', ja: 'すべて', value: '0' },
  { zh: '$', en: '$', ja: '$', value: '1' },
  { zh: '$$', en: '$$', ja: '$$', value: '2' },
  { zh: '$$$', en: '$$$', ja: '$$$', value: '3' },
  { zh: '$$$$', en: '$$$$', ja: '$$$$', value: '4' }
];

// Detailed filter options for collapsible sections
export const ACCESSIBILITY_OPTIONS = [
  { key: 'accessibleEntrance', zh: '無障礙入口', en: 'Accessible Entrance', ja: 'バリアフリー入口', keyword: 'wheelchair accessible entrance' },
  { key: 'accessibleSeating', zh: '無障礙座位', en: 'Accessible Seating', ja: 'バリアフリー席', keyword: 'wheelchair accessible seating' },
  { key: 'accessibleParking', zh: '無障礙停車場', en: 'Accessible Parking', ja: '障害者用駐車場', keyword: 'accessible parking' }
];

export const CHILDREN_OPTIONS = [
  { key: 'changingTable', zh: '有尿布台', en: 'Changing Table', ja: 'おむつ交換台', keyword: 'changing table' },
  { key: 'highChair', zh: '兒童高腳椅', en: 'High Chair', ja: '子供用椅子', keyword: 'high chair' },
  { key: 'kidsMenu', zh: '適合兒童', en: 'Kids Menu', ja: 'キッズメニュー', keyword: 'kids menu family friendly' }
];

export const PET_OPTIONS = [
  { key: 'dogsAllowed', zh: '允許狗狗入內', en: 'Dogs Allowed', ja: '犬OK', keyword: 'dogs allowed' },
  { key: 'dogsOutdoorOnly', zh: '允許帶狗進入戶外區域', en: 'Dogs Outdoor Only', ja: '屋外犬OK', keyword: 'dogs allowed outdoor' },
  { key: 'dogFriendlyAccommodation', zh: '可帶狗入住', en: 'Dog Friendly', ja: 'ペット可', keyword: 'pet friendly dog friendly' }
];

export const DEFAULT_MAP_URL = 'https://www.google.com/maps?q=Hong+Kong+Island&output=embed';
