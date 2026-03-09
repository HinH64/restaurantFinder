import { FilterState, Language } from '../types'
import { getLocalizedText } from '../utils/localize'

export interface ReviewSummary {
  highlights: string[]
  disadvantages: string[]
  popularDishes: string[]
}

export interface AISearchResult {
  restaurants: {
    name: string
    address: string
    reason: string
  }[]
}

export const summarizeRestaurant = async (
  restaurantName: string,
  address: string,
  lang: Language
): Promise<ReviewSummary> => {
  const response = await fetch('/api/ai/summarize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ restaurantName, address, lang }),
  })

  if (!response.ok) {
    throw new Error(
      getLocalizedText(
        {
          zh: '無法獲取餐廳摘要，請稍後再試。',
          en: 'Unable to get restaurant summary. Please try again.',
          ja: 'レストランの概要を取得できません。もう一度お試しください。',
        },
        lang
      )
    )
  }

  const data = await response.json()
  if (data.error) {
    throw new Error(
      getLocalizedText(
        {
          zh: '無法獲取餐廳摘要，請稍後再試。',
          en: 'Unable to get restaurant summary. Please try again.',
          ja: 'レストランの概要を取得できません。もう一度お試しください。',
        },
        lang
      )
    )
  }

  return data as ReviewSummary
}

export const aiSearchRestaurants = async (
  query: string,
  country: string,
  lang: Language,
  filters?: FilterState,
  useFilters?: boolean
): Promise<AISearchResult> => {
  const response = await fetch('/api/ai/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, country, lang, filters, useFilters }),
  })

  if (!response.ok) {
    throw new Error(
      getLocalizedText(
        {
          zh: 'AI 搜尋發生錯誤，請稍後再試。',
          en: 'AI search error. Please try again later.',
          ja: 'AI検索エラーが発生しました。後でもう一度お試しください。',
        },
        lang
      )
    )
  }

  const data = await response.json()
  if (data.error) {
    throw new Error(
      getLocalizedText(
        {
          zh: 'AI 搜尋發生錯誤，請稍後再試。',
          en: 'AI search error. Please try again later.',
          ja: 'AI検索エラーが発生しました。後でもう一度お試しください。',
        },
        lang
      )
    )
  }

  return data as AISearchResult
}
