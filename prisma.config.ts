import { config } from 'dotenv'
config({ path: '.env.local' }) // load .env.local first (Next.js convention)
config()                        // fallback: also load .env

import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env['DATABASE_URL'],
  },
})
