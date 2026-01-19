
import { GoogleGenAI } from "@google/genai";
import { FilterState, SearchResult, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const searchRestaurants = async (
  query: string,
  filters: FilterState,
  lang: Language,
  location?: { latitude: number; longitude: number }
): Promise<SearchResult> => {
  const model = "gemini-2.5-flash";
  
  // Prioritize manual district if the selection is "全部地區" or if provided
  const targetArea = filters.district !== '全部地區' ? filters.district : (query.includes(' ') ? '' : filters.city);
  
  const prompt = `
    I am looking for restaurants in ${filters.city}, ${filters.country}.
    STRICT FILTERING REQUIRED:
    - Target Location/Area: ${filters.district === '全部地區' ? filters.city : filters.district}
    - Cuisine: ${filters.cuisine === '全部菜式' ? 'any' : filters.cuisine}
    - Keywords: ${query || "recommendations"}
    
    CRITICAL: 
    - Only return places that accurately match the selected cuisine and location.
    - If a specific manual area was provided in the query or selection, prioritize it.
    - Use Google Maps tool.
    - NO text summary.
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

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const sources = chunks
      .filter(chunk => chunk.maps)
      .map(chunk => ({
        title: chunk.maps!.title,
        url: chunk.maps!.uri
      }));

    return { text: "", sources };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error(lang === 'zh' ? "搜尋發生錯誤，請稍後再試。" : "Search error. Please try again later.");
  }
};
