
import { GoogleGenAI } from "@google/genai";
import { FilterState, SearchResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const searchRestaurants = async (
  query: string,
  filters: FilterState,
  location?: { latitude: number; longitude: number }
): Promise<SearchResult> => {
  const model = "gemini-2.5-flash";
  
  const filterDescription = `
    國家: ${filters.country}
    地區: ${filters.district !== "全部地區" ? filters.district : filters.country + "各區"}
    菜式: ${filters.cuisine !== "全部菜式" ? filters.cuisine : "不限"}
    預算: ${filters.priceRange !== "全部價格" ? filters.priceRange : "不限"}
    特點: ${filters.feature !== "全部功能" ? filters.feature : "不限"}
  `.trim();

  const prompt = `
    我正使用地圖介面搜尋 ${filters.country} 的餐廳。
    關鍵字: ${query || "熱門推介"}
    ${filterDescription}

    你必須使用 Google Maps 工具。
    回覆限制：
    - 只需用一句簡短廣東話作總結（例如：「幫你喺 ${filters.district} 搵到幾間好味嘅餐廳。」）。
    - 不要提供長篇詳細評價。
    - 確保提供的 Google Maps 地圖標記（grounding chunks）準確指向 ${filters.country}。
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: location ? {
            latLng: {
              latitude: location.latitude,
              longitude: location.longitude
            }
          } : undefined
        }
      },
    });

    const text = response.text || "已為你更新地圖。";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const sources = chunks
      .filter(chunk => chunk.maps)
      .map(chunk => ({
        title: chunk.maps!.title,
        url: chunk.maps!.uri
      }));

    return { text, sources };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("搵唔到相關餐廳，請試下換個地區或條件。");
  }
};
