
export type Language = 'zh' | 'en';
export type Theme = 'light' | 'dark';

export interface FilterState {
  country: string;
  city: string;
  district: string;
  cuisine: string;
}

export interface LocalizedItem {
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

export const COUNTRIES: LocalizedItem[] = [
  { zh: "香港", en: "Hong Kong" },
  { zh: "日本", en: "Japan" },
  { zh: "英國", en: "United Kingdom" }
];

export const CITIES_MAP: Record<string, LocalizedItem[]> = {
  "香港": [
    { zh: "香港島", en: "Hong Kong Island" },
    { zh: "九龍", en: "Kowloon" },
    { zh: "新界", en: "New Territories" },
    { zh: "離島", en: "Outlying Islands" }
  ],
  "日本": [
    { zh: "東京", en: "Tokyo" },
    { zh: "大阪", en: "Osaka" },
    { zh: "京都", en: "Kyoto" },
    { zh: "福岡", en: "Fukuoka" },
    { zh: "北海道", en: "Hokkaido" }
  ],
  "英國": [
    { zh: "倫敦", en: "London" },
    { zh: "曼徹斯特", en: "Manchester" },
    { zh: "愛丁堡", en: "Edinburgh" },
    { zh: "伯明翰", en: "Birmingham" }
  ]
};

export const DISTRICTS_MAP: Record<string, LocalizedItem[]> = {
  "香港島": [
    { zh: "全部地區", en: "All Districts" },
    { zh: "中環", en: "Central" },
    { zh: "金鐘", en: "Admiralty" },
    { zh: "灣仔", en: "Wan Chai" },
    { zh: "銅鑼灣", en: "Causeway Bay" },
    { zh: "跑馬地", en: "Happy Valley" },
    { zh: "天后", en: "Tin Hau" },
    { zh: "北角", en: "North Point" },
    { zh: "鰂魚涌", en: "Quarry Bay" },
    { zh: "太古", en: "Tai Koo" },
    { zh: "西灣河", en: "Sai Wan Ho" },
    { zh: "筲箕灣", en: "Shau Kei Wan" },
    { zh: "柴灣", en: "Chai Wan" },
    { zh: "西環", en: "Western District" },
    { zh: "香港仔", en: "Aberdeen" },
    { zh: "鴨脷洲", en: "Ap Lei Chau" }
  ],
  "九龍": [
    { zh: "全部地區", en: "All Districts" },
    { zh: "尖沙咀", en: "Tsim Sha Tsui" },
    { zh: "佐敦", en: "Jordan" },
    { zh: "油麻地", en: "Yau Ma Tei" },
    { zh: "旺角", en: "Mong Kok" },
    { zh: "太子", en: "Prince Edward" },
    { zh: "深水埗", en: "Sham Shui Po" },
    { zh: "長沙灣", en: "Cheung Sha Wan" },
    { zh: "荔枝角", en: "Lai Chi Kok" },
    { zh: "美孚", en: "Mei Foo" },
    { zh: "九龍城", en: "Kowloon City" },
    { zh: "樂富", en: "Lok Fu" },
    { zh: "黃大仙", en: "Wong Tai Sin" },
    { zh: "鑽石山", en: "Diamond Hill" },
    { zh: "新蒲崗", en: "San Po Kong" },
    { zh: "九龍灣", en: "Kowloon Bay" },
    { zh: "牛頭角", en: "Ngau Tau Kok" },
    { zh: "觀塘", en: "Kwun Tong" },
    { zh: "藍田", en: "Lam Tin" },
    { zh: "油塘", en: "Yau Tong" }
  ],
  "新界": [
    { zh: "全部地區", en: "All Districts" },
    { zh: "荃灣", en: "Tsuen Wan" },
    { zh: "葵涌", en: "Kwai Chung" },
    { zh: "葵芳", en: "Kwai Fong" },
    { zh: "青衣", en: "Tsing Yi" },
    { zh: "屯門", en: "Tuen Mun" },
    { zh: "元朗", en: "Yuen Long" },
    { zh: "天水圍", en: "Tin Shui Wai" },
    { zh: "深井", en: "Sham Tseng" },
    { zh: "上水", en: "Sheung Shui" },
    { zh: "粉嶺", en: "Fanling" },
    { zh: "大埔", en: "Tai Po" },
    { zh: "太和", en: "Tai Wo" },
    { zh: "沙田", en: "Shatin" },
    { zh: "火炭", en: "Fo Tan" },
    { zh: "大圍", en: "Tai Wai" },
    { zh: "馬料水", en: "Ma Liu Shui" },
    { zh: "馬安山", en: "Ma On Shan" },
    { zh: "將軍澳", en: "Tseung Kwan O" },
    { zh: "坑口", en: "Hang Hau" },
    { zh: "調景嶺", en: "Tiu Keng Leng" },
    { zh: "寶琳", en: "Po Lam" },
    { zh: "西貢", en: "Sai Kung" }
  ],
  "離島": [
    { zh: "全部地區", en: "All Districts" },
    { zh: "東涌", en: "Tung Chung" },
    { zh: "愉景灣", en: "Discovery Bay" },
    { zh: "赤鱲角", en: "Chek Lap Kok" },
    { zh: "大澳", en: "Tai O" },
    { zh: "長洲", en: "Cheung Chau" },
    { zh: "南丫島", en: "Lamma Island" },
    { zh: "坪洲", en: "Peng Chau" }
  ],
  "東京": [
    { zh: "全部地區", en: "All Districts" },
    { zh: "新宿", en: "Shinjuku" },
    { zh: "澀谷", en: "Shibuya" },
    { zh: "銀座", en: "Ginza" },
    { zh: "秋葉原", en: "Akihabara" },
    { zh: "淺草", en: "Asakusa" },
    { zh: "六本木", en: "Roppongi" }
  ],
  "大阪": [
    { zh: "全部地區", en: "All Districts" },
    { zh: "梅田", en: "Umeda" },
    { zh: "心齋橋", en: "Shinsaibashi" },
    { zh: "難波", en: "Namba" },
    { zh: "天王寺", en: "Tennoji" }
  ],
  "京都": [
    { zh: "全部地區", en: "All Districts" },
    { zh: "祇園", en: "Gion" },
    { zh: "嵐山", en: "Arashiyama" },
    { zh: "河原町", en: "Kawaramachi" }
  ],
  "福岡": [
    { zh: "全部地區", en: "All Districts" },
    { zh: "天神", en: "Tenjin" },
    { zh: "博多", en: "Hakata" },
    { zh: "中洲", en: "Nakasu" }
  ],
  "北海道": [
    { zh: "全部地區", en: "All Districts" },
    { zh: "札幌", en: "Sapporo" },
    { zh: "函館", en: "Hakodate" },
    { zh: "小樽", en: "Otaru" }
  ],
  "倫敦": [
    { zh: "全部地區", en: "All Districts" },
    { zh: "蘇豪區", en: "Soho" },
    { zh: "柯芬園", en: "Covent Garden" },
    { zh: "南肯辛頓", en: "South Kensington" },
    { zh: "卡姆登市集", en: "Camden Town" },
    { zh: "威斯敏斯特", en: "Westminster" }
  ],
  "曼徹斯特": [
    { zh: "全部地區", en: "All Districts" },
    { zh: "北區", en: "Northern Quarter" },
    { zh: "丁斯蓋特", en: "Deansgate" },
    { zh: "安考茨", en: "Ancoats" }
  ],
  "愛丁堡": [
    { zh: "全部地區", en: "All Districts" },
    { zh: "舊城區", en: "Old Town" },
    { zh: "新城區", en: "New Town" },
    { zh: "利斯", en: "Leith" }
  ],
  "伯明翰": [
    { zh: "全部地區", en: "All Districts" },
    { zh: "珠寶區", en: "Jewellery Quarter" },
    { zh: "迪格貝斯", en: "Digbeth" },
    { zh: "市中心", en: "City Centre" }
  ]
};

export const CUISINES: LocalizedItem[] = [
  { zh: "全部菜式", en: "All Cuisines" },
  { zh: "港式", en: "Hong Kong Style" },
  { zh: "日本菜", en: "Japanese" },
  { zh: "泰國菜", en: "Thai" },
  { zh: "韓國菜", en: "Korean" },
  { zh: "西餐", en: "Western" },
  { zh: "意大利菜", en: "Italian" },
  { zh: "台灣菜", en: "Taiwanese" },
  { zh: "火鍋", en: "Hot Pot" },
  { zh: "甜品", en: "Dessert" },
  { zh: "茶餐廳", en: "Cha Chaan Teng" },
  { zh: "四川菜", en: "Sichuan" },
  { zh: "順德菜", en: "Shunde" },
  { zh: "星馬菜", en: "Singaporean/Malaysian" },
  { zh: "法國菜", en: "French" }
];
