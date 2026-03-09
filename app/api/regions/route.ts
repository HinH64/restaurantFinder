import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'
import { withCache, TTL } from '../../../lib/cache'
import sideBarData from '../../../data/sideBar.json'

interface RegionsData {
  countries: { id: string; zh: string; en: string; ja: string }[]
  cities: { id: string; countryId: string; zh: string; en: string; ja: string; lat?: number; lng?: number }[]
  districts: { id: string; cityId: string; zh: string; en: string; ja: string }[]
}

// Fallback to static JSON when database is not yet configured
function getStaticData(): RegionsData {
  return {
    countries: sideBarData.countries.map((c: any) => ({ id: c.id, zh: c.zh, en: c.en, ja: c.ja })),
    cities: sideBarData.cities.map((c: any) => ({ id: c.id, countryId: c.countryId, zh: c.zh, en: c.en, ja: c.ja })),
    districts: sideBarData.districts.map((d: any) => ({ id: d.id, cityId: d.cityId, zh: d.zh, en: d.en, ja: d.ja })),
  }
}

async function getDbData(): Promise<RegionsData> {
  if (!prisma) return getStaticData()

  const [countries, cities, districts] = await Promise.all([
    (prisma as any).country.findMany({ orderBy: { nameEn: 'asc' } }),
    (prisma as any).city.findMany({ orderBy: { nameEn: 'asc' } }),
    (prisma as any).district.findMany({ orderBy: { nameEn: 'asc' } }),
  ])

  return {
    countries: countries.map((c: any) => ({ id: c.id, zh: c.nameZh, en: c.nameEn, ja: c.nameJa })),
    cities: cities.map((c: any) => ({ id: c.id, countryId: c.countryId, zh: c.nameZh, en: c.nameEn, ja: c.nameJa, lat: c.lat ?? undefined, lng: c.lng ?? undefined })),
    districts: districts.map((d: any) => ({ id: d.id, cityId: d.cityId, zh: d.nameZh, en: d.nameEn, ja: d.nameJa })),
  }
}

export async function GET() {
  try {
    const data = await withCache<RegionsData>('regions:all', TTL.REGIONS, getDbData)
    return NextResponse.json(data)
  } catch (err: any) {
    // Last resort: return static data
    return NextResponse.json(getStaticData())
  }
}
