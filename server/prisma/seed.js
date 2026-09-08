import argon2 from 'argon2';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 4,
};

async function seed() {
  console.log('🌱 Starting Quantum Platform Database Seeding...');

  const defaultUsers = [
    {
      name: 'Quantum Administrator',
      email: 'admin@quantum.platform',
      password: 'AdminQuantum@2025!',
      role: 'ADMIN',
    },
    {
      name: 'Dr. Eleanor Vance',
      email: 'instructor@quantum.platform',
      password: 'Instructor@2025!',
      role: 'INSTRUCTOR',
    },
    {
      name: 'Dr. Aris Thorne',
      email: 'researcher@quantum.platform',
      password: 'Researcher@2025!',
      role: 'RESEARCHER',
    },
    {
      name: 'Kai Chen',
      email: 'learner@quantum.platform',
      password: 'Learner@2025!',
      role: 'LEARNER',
    },
  ];

  for (const userDef of defaultUsers) {
    const existing = await prisma.user.findUnique({
      where: { email: userDef.email },
    });

    const passwordHash = await argon2.hash(userDef.password, ARGON2_OPTIONS);

    if (!existing) {
      await prisma.user.create({
        data: {
          name: userDef.name,
          email: userDef.email,
          passwordHash,
          role: userDef.role,
          isEmailVerified: true,
        },
      });
      console.log(`✅ Created ${userDef.role}: ${userDef.email} (Password: ${userDef.password})`);
    } else {
      await prisma.user.update({
        where: { id: existing.id },
        data: {
          passwordHash,
          role: userDef.role,
          isEmailVerified: true,
        },
      });
      console.log(`🔄 Updated ${userDef.role}: ${userDef.email} (Password: ${userDef.password})`);
    }
  }

  console.log('\n✨ Database seeding completed successfully!');
}

seed()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
