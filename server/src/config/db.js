import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully (Neon PostgreSQL)');
  } catch (error) {
    console.error('Database connection error:', error.message);
  }
};

export default prisma;
