import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { withCache, TTL } from '../../../../lib/cache'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })
const MODELS = ['gemini-2.5-flash', 'gemini-2.5-flash-lite']

interface AISearchResult {
  restaurants: { name: string; address: string; reason: string }[]
}

function buildLocationContext(country: string, filters?: any, useFilters?: boolean): string {
  let locationContext = country
  if (useFilters && filters) {
    const cityTerm = filters.city || ''
    const districtTerm = filters.district === 'All Districts' ? '' : filters.district
    const cuisineTerm = filters.cuisine === 'All Cuisines' ? '' : filters.cuisine
    if (cityTerm) locationContext += `, ${cityTerm}`
    if (districtTerm) locationContext += `, ${districtTerm}`
    if (cuisineTerm) locationContext += ` (${cuisineTerm} cuisine)`
  }
  return locationContext
}

function getPrompt(query: string, locationContext: string, lang: string): string {
  if (lang === 'zh') {
    return `請根據以下條件搜尋餐廳：
地點：${locationContext}
搜尋條件：${query}

請使用 Google 搜尋找出符合條件的真實餐廳。回傳最多 10 間餐廳。

請用以下 JSON 格式回覆：
{
  "restaurants": [
    {
      "name": "餐廳名稱",
      "address": "完整地址",
      "reason": "簡短說明為何推薦（不超過30字）"
    }
  ]
}

只回覆 JSON，不要其他文字。如果找不到符合條件的餐廳，回傳空陣列。`
  } else if (lang === 'ja') {
    return `以下の条件でレストランを検索してください：
場所：${locationContext}
検索条件：${query}

Google検索を使用して、条件に合う実際のレストランを見つけてください。最大10店舗を返してください。

以下のJSON形式で回答してください：
{
  "restaurants": [
    {
      "name": "レストラン名",
      "address": "完全な住所",
      "reason": "おすすめの理由（30文字以内）"
    }
  ]
}

JSONのみを回答し、他のテキストは含めないでください。条件に合うレストランが見つからない場合は、空の配列を返してください。`
  } else {
    return `Please search for restaurants based on the following criteria:
Location: ${locationContext}
Search criteria: ${query}

Use Google Search to find real restaurants that match the criteria. Return up to 10 restaurants.

Respond in the following JSON format:
{
  "restaurants": [
    {
      "name": "Restaurant name",
      "address": "Full address",
      "reason": "Brief reason for recommendation (max 30 words)"
    }
  ]
}

Only respond with JSON, no other text. If no matching restaurants are found, return an empty array.`
  }
}

async function fetchAISearch(query: string, locationContext: string, lang: string): Promise<AISearchResult> {
  const prompt = getPrompt(query, locationContext, lang)
  let lastError: Error | null = null

  for (const model of MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          temperature: 0,
          tools: [{ googleSearch: {} }],
        },
      })

      const text = response.text || ''
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return { restaurants: (parsed.restaurants || []).slice(0, 10) }
      }

      return { restaurants: [] }
    } catch (error) {
      lastError = error as Error
    }
  }

  throw lastError || new Error('AI search failed')
}

export async function POST(req: NextRequest) {
  const { query, country, lang, filters, useFilters } = await req.json()

  const locationContext = buildLocationContext(country, filters, useFilters)
  const cacheKey = `ai:search:${lang}:${locationContext}:${query}`
    .toLowerCase()
    .replace(/\s+/g, '_')
    .slice(0, 200)

  try {
    const data = await withCache<AISearchResult>(cacheKey, TTL.AI_SEARCH, () =>
      fetchAISearch(query, locationContext, lang)
    )
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'AI search failed' }, { status: 500 })
  }
}
