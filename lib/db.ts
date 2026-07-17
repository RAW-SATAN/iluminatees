import { PrismaClient } from '@/app/generated/prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

/*
 * The StoreSetting table was never created by the original `prisma db push`
 * (only Order exists in Neon), so every settings/subscriber/product-edits
 * query 500s. Self-heal: create it on first use, once per instance.
 */
let storeSettingReady = false
export async function ensureStoreSetting() {
  if (storeSettingReady) return
  await prisma.$executeRawUnsafe(
    'CREATE TABLE IF NOT EXISTS "StoreSetting" ("key" TEXT NOT NULL PRIMARY KEY, "value" TEXT NOT NULL)'
  )
  storeSettingReady = true
}
