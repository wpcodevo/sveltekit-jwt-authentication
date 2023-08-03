import { PrismaClient } from '@prisma/client';

const options: any = process.env.NODE_ENV === 'development' ? { log: ['query'] } : {};
const prisma = globalThis.prisma ?? new PrismaClient(options);

if (process.env.NODE_ENV === 'development') globalThis.prisma = prisma;

export { prisma };
