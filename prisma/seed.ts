/**
 * Seed script: migrate data/sideBar.json into the database
 * Run with: npx ts-node --esm prisma/seed.ts
 */
import { config } from 'dotenv'
config({ path: '.env.local' })
config()

import { readFileSync } from 'fs'
import { resolve } from 'path'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter } as any)

const sideBarData = JSON.parse(
  readFileSync(resolve(process.cwd(), 'data/sideBar.json'), 'utf-8')
)

// City coordinates from placesService.ts (for storing lat/lng in DB)
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  'hk-island':        { lat: 22.2783, lng: 114.1747 },
  'kowloon':          { lat: 22.3193, lng: 114.1694 },
  'new-territories':  { lat: 22.4445, lng: 114.0227 },
  'outlying-islands': { lat: 22.2614, lng: 113.9456 },
  'tokyo':            { lat: 35.6762, lng: 139.6503 },
  'osaka':            { lat: 34.6937, lng: 135.5023 },
  'kyoto':            { lat: 35.0116, lng: 135.7681 },
  'fukuoka':          { lat: 33.5904, lng: 130.4017 },
  'hokkaido':         { lat: 43.0642, lng: 141.3469 },
  'london':           { lat: 51.5074, lng: -0.1278  },
  'manchester':       { lat: 53.4808, lng: -2.2426  },
  'edinburgh':        { lat: 55.9533, lng: -3.1883  },
  'birmingham':       { lat: 52.4862, lng: -1.8904  },
}

const CUISINES = [
  { id: 'all',       nameZh: '所有菜式', nameEn: 'All Cuisines',           nameJa: 'すべての料理',             category: null },
  { id: 'hk-style',  nameZh: '港式',     nameEn: 'Hong Kong Style',        nameJa: '香港スタイル',             category: 'asian' },
  { id: 'japanese',  nameZh: '日本料理', nameEn: 'Japanese',               nameJa: '和食',                     category: 'asian' },
  { id: 'thai',      nameZh: '泰國菜',   nameEn: 'Thai',                   nameJa: 'タイ料理',                 category: 'asian' },
  { id: 'korean',    nameZh: '韓國菜',   nameEn: 'Korean',                 nameJa: '韓国料理',                 category: 'asian' },
  { id: 'western',   nameZh: '西餐',     nameEn: 'Western',                nameJa: '洋食',                     category: 'western' },
  { id: 'italian',   nameZh: '意大利菜', nameEn: 'Italian',                nameJa: 'イタリア料理',             category: 'western' },
  { id: 'french',    nameZh: '法國菜',   nameEn: 'French',                 nameJa: 'フランス料理',             category: 'western' },
  { id: 'taiwanese', nameZh: '台灣菜',   nameEn: 'Taiwanese',              nameJa: '台湾料理',                 category: 'asian' },
  { id: 'hotpot',    nameZh: '火鍋',     nameEn: 'Hot Pot',                nameJa: '火鍋',                     category: 'asian' },
  { id: 'dessert',   nameZh: '甜品',     nameEn: 'Dessert',                nameJa: 'デザート',                 category: 'cafe' },
  { id: 'chachaan',  nameZh: '茶餐廳',   nameEn: 'Cha Chaan Teng',         nameJa: '茶餐廳',                   category: 'hk' },
  { id: 'sichuan',   nameZh: '四川菜',   nameEn: 'Sichuan',                nameJa: '四川料理',                 category: 'asian' },
  { id: 'shunde',    nameZh: '順德菜',   nameEn: 'Shunde',                 nameJa: '順徳料理',                 category: 'asian' },
  { id: 'sgmy',      nameZh: '星馬菜',   nameEn: 'Singaporean/Malaysian',  nameJa: 'シンガポール/マレーシア料理', category: 'asian' },
]

async function main() {
  console.log('Seeding database...')

  for (const country of sideBarData.countries) {
    await (prisma as any).country.upsert({
      where: { id: country.id },
      update: { nameZh: country.zh, nameEn: country.en, nameJa: country.ja },
      create: { id: country.id, nameZh: country.zh, nameEn: country.en, nameJa: country.ja },
    })
  }
  console.log(`✓ ${sideBarData.countries.length} countries`)

  for (const city of sideBarData.cities) {
    const coords = CITY_COORDS[city.id]
    await (prisma as any).city.upsert({
      where: { id: city.id },
      update: { nameZh: city.zh, nameEn: city.en, nameJa: city.ja, lat: coords?.lat, lng: coords?.lng },
      create: { id: city.id, countryId: city.countryId, nameZh: city.zh, nameEn: city.en, nameJa: city.ja, lat: coords?.lat, lng: coords?.lng },
    })
  }
  console.log(`✓ ${sideBarData.cities.length} cities`)

  for (const district of sideBarData.districts) {
    await (prisma as any).district.upsert({
      where: { id: district.id },
      update: { nameZh: district.zh, nameEn: district.en, nameJa: district.ja },
      create: { id: district.id, cityId: district.cityId, nameZh: district.zh, nameEn: district.en, nameJa: district.ja },
    })
  }
  console.log(`✓ ${sideBarData.districts.length} districts`)

  for (const cuisine of CUISINES) {
    await (prisma as any).cuisine.upsert({
      where: { id: cuisine.id },
      update: { nameZh: cuisine.nameZh, nameEn: cuisine.nameEn, nameJa: cuisine.nameJa, category: cuisine.category },
      create: { id: cuisine.id, nameZh: cuisine.nameZh, nameEn: cuisine.nameEn, nameJa: cuisine.nameJa, category: cuisine.category },
    })
  }
  console.log(`✓ ${CUISINES.length} cuisines`)

  console.log('\nDone! Database seeded successfully.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
