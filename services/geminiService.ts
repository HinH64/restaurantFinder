
import { GoogleGenAI } from "@google/genai";
import { FilterState, SearchResult, Language } from "../types";
import { getLocalizedText } from "../utils/localize";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || "" });


const MODELS = ['gemini-2.5-flash', 'gemini-2.5-flash-lite'];

export interface ReviewSummary {
  highlights: string[];
  disadvantages: string[];
  popularDishes: string[];
}

export const summarizeRestaurant = async (
  restaurantName: string,
  address: string,
  lang: Language
): Promise<ReviewSummary> => {
  const getPrompt = () => {
    if (lang === 'zh') {
      return `請搜尋「${restaurantName}」(位於 ${address}) 的真實用戶評論。

請根據網上找到的用戶評論，總結以下資訊：

1. 優點 (highlights)：總結3個用戶常提到的優點或正面評價
2. 缺點 (disadvantages)：總結2個用戶常提到的缺點或需改善之處
3. 推薦菜式 (popularDishes)：最多3個用戶推薦的菜式

請用繁體中文回覆，格式如下（使用JSON格式）：
{
  "highlights": ["優點1", "優點2", "優點3"],
  "disadvantages": ["缺點1", "缺點2"],
  "popularDishes": ["推薦菜式1", "推薦菜式2", "推薦菜式3"]
}

只回覆JSON，不要其他文字。`;
    } else if (lang === 'ja') {
      return `「${restaurantName}」（住所：${address}）の実際のユーザーレビューを検索してください。

オンラインで見つけたユーザーレビューに基づいて、以下の情報をまとめてください：

1. 良い点 (highlights)：ユーザーがよく挙げる3つの良い点やポジティブな評価
2. 改善点 (disadvantages)：ユーザーがよく挙げる2つの改善点や課題
3. 人気メニュー (popularDishes)：ユーザーがおすすめする料理を最大3つ

以下のJSON形式で日本語で回答してください：
{
  "highlights": ["良い点1", "良い点2", "良い点3"],
  "disadvantages": ["改善点1", "改善点2"],
  "popularDishes": ["人気メニュー1", "人気メニュー2", "人気メニュー3"]
}

JSONのみを回答し、他のテキストは含めないでください。`;
    } else {
      return `Please search for real user reviews of "${restaurantName}" (located at ${address}).

Based on user reviews found online, summarize:

1. Pros (highlights): Summarize 3 common positive points from user reviews
2. Cons (disadvantages): Summarize 2 common negative points or areas for improvement
3. Popular dishes: Maximum 3 dishes recommended by users

Respond in the following JSON format:
{
  "highlights": ["Pro 1", "Pro 2", "Pro 3"],
  "disadvantages": ["Con 1", "Con 2"],
  "popularDishes": ["Dish 1", "Dish 2", "Dish 3"]
}

Only respond with JSON, no other text.`;
    }
  };

  const prompt = getPrompt();

  let lastError: Error | null = null;

  // Try each model in order until one succeeds
  for (const model of MODELS) {
    try {
      console.log(`Trying model: ${model}`);
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "";

      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log(`Success with model: ${model}`);
        return {
          highlights: (parsed.highlights || []).slice(0, 3),
          disadvantages: (parsed.disadvantages || []).slice(0, 2),
          popularDishes: (parsed.popularDishes || []).slice(0, 3),
        };
      }

      return {
        highlights: [],
        disadvantages: [],
        popularDishes: [],
      };
    } catch (error) {
      console.error(`Model ${model} failed:`, error);
      lastError = error as Error;
      // Continue to next model
    }
  }

  // All models failed
  console.error("All Gemini models failed:", lastError);
  throw new Error(getLocalizedText({
    zh: "無法獲取餐廳摘要，請稍後再試。",
    en: "Unable to get restaurant summary. Please try again.",
    ja: "レストランの概要を取得できません。もう一度お試しください。"
  }, lang));
};

export const searchRestaurants = async (
  query: string,
  filters: FilterState,
  lang: Language,
  location?: { latitude: number; longitude: number }
): Promise<SearchResult> => {
  const districtTerm = filters.district === 'All Districts' ? '' : filters.district;
  const locationPrompt = `${filters.country}, ${filters.city} ${districtTerm}`;

  const prompt = `
    Find restaurants in: ${locationPrompt}
    Cuisine: ${filters.cuisine === 'All Cuisines' ? 'any' : filters.cuisine}
    Keywords: ${query || "recommendations"}

    CRITICAL: You must use the Google Maps tool to find real places that exist in the specified area.
  `;

  let lastError: Error | null = null;

  // Try each model in order until one succeeds
  for (const model of MODELS) {
    try {
      console.log(`Search trying model: ${model}`);
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

      console.log(`Search success with model: ${model}`);
      return { text: response.text || "", sources };
    } catch (error) {
      console.error(`Search model ${model} failed:`, error);
      lastError = error as Error;
      // Continue to next model
    }
  }

  // All models failed
  console.error("All Gemini search models failed:", lastError);
  throw new Error(getLocalizedText({
    zh: "搜尋發生錯誤，請稍後再試。",
    en: "Search error. Please try again later.",
    ja: "検索エラーが発生しました。後でもう一度お試しください。"
  }, lang));
};
