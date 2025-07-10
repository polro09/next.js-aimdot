<<<<<<< HEAD
// lib/db.ts - Prisma 클라이언트 설정
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

=======
// lib/db.ts - Prisma 클라이언트 설정
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

>>>>>>> 3b599428ec14d20c82b0789575df317f455352b8
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma