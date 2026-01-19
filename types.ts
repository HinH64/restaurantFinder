
export interface FilterState {
  country: string;
  district: string;
  cuisine: string;
  priceRange: string;
  feature: string;
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

export const COUNTRIES = ["香港", "日本", "英國"];

export const DISTRICTS_MAP: Record<string, string[]> = {
  "香港": ["全部地區", "中環", "銅鑼灣", "尖沙咀", "旺角", "觀塘", "荃灣", "沙田", "元朗", "西環", "灣仔", "深水埗", "九龍城"],
  "日本": ["全部地區", "東京", "大阪", "京都", "福岡", "札幌", "名古屋", "廣島", "沖繩"],
  "英國": ["全部地區", "倫敦", "曼徹斯特", "伯明翰", "愛丁堡", "格拉斯哥", "利物浦", "布里斯托"]
};

export const CUISINES = [
  "全部菜式", "港式", "日本菜", "泰國菜", "韓國菜", "西餐", "意大利菜", "台灣菜", "火鍋", "甜品", "茶餐廳"
];

export const PRICE_RANGES = [
  "全部價格", "平民化", "中等價錢", "高級料理", "米芝蓮級別"
];

export const FEATURES = [
  "全部功能", "適合聚會", "浪漫約會", "親子餐廳", "寵物友善", "打卡必到", "商務應酬"
];
