import { PrismaClient } from '@prisma/client';

// Singleton pattern dla Prisma Client
let prisma;

export const getPrismaClient = () => {
    if (!prisma) {
        prisma = new PrismaClient({
            log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
        });
    }
    return prisma;
};

export const disconnectDatabase = async () => {
    if (prisma) {
        await prisma.$disconnect();
    }
};
