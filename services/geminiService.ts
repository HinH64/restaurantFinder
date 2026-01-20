
import { GoogleGenAI } from "@google/genai";
import { FilterState, SearchResult, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || "" });

export const searchRestaurants = async (
  query: string,
  filters: FilterState,
  lang: Language,
  location?: { latitude: number; longitude: number }
): Promise<SearchResult> => {
  const model = "gemini-2.5-flash";
  
  const districtTerm = filters.district === '全部地區' ? '' : filters.district;
  const locationPrompt = `${filters.country}, ${filters.city} ${districtTerm}`;

  const prompt = `
    Find restaurants in: ${locationPrompt}
    Cuisine: ${filters.cuisine === '全部菜式' ? 'any' : filters.cuisine}
    Keywords: ${query || "recommendations"}
    
    CRITICAL: You must use the Google Maps tool to find real places that exist in the specified area.
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

    const metadata = response.candidates?.[0]?.groundingMetadata;
    const chunks = metadata?.groundingChunks || [];
    
    const sources = chunks
      .filter(chunk => chunk.maps)
      .map(chunk => ({
        title: chunk.maps!.title,
        url: chunk.maps!.uri
      }));

    return { text: response.text || "", sources };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error(lang === 'zh' ? "搜尋發生錯誤，請稍後再試。" : "Search error. Please try again later.");
  }
};
