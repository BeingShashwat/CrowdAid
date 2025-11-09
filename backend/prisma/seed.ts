import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@crowdaid.in' },
    update: {},
    create: {
      email: 'admin@crowdaid.in',
      passwordHash: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      emailVerified: true,
      role: 'ADMIN',
      userType: 'USER',
      isActive: true,
    },
  });

  // Create demo user
  const userPassword = await bcrypt.hash('demo123', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@crowdaid.in' },
    update: {},
    create: {
      email: 'demo@crowdaid.in',
      passwordHash: userPassword,
      firstName: 'Demo',
      lastName: 'User',
      emailVerified: true,
      role: 'USER',
      userType: 'USER',
      isActive: true,
    },
  });

  // Create demo volunteer
  const volunteerPassword = await bcrypt.hash('volunteer123', 10);
  const volunteer = await prisma.user.upsert({
    where: { email: 'volunteer@crowdaid.in' },
    update: {},
    create: {
      email: 'volunteer@crowdaid.in',
      passwordHash: volunteerPassword,
      firstName: 'Demo',
      lastName: 'Volunteer',
      emailVerified: true,
      role: 'VOLUNTEER',
      userType: 'VOLUNTEER',
      isActive: true,
      volunteerProfiles: {
        create: {
          isVerified: true,
          skills: ['First Aid', 'CPR', 'Emergency Response'],
          rating: 4.8,
          totalResponses: 25,
          successfulHelps: 23,
          bio: 'Experienced volunteer with medical training',
        },
      },
    },
  });

  console.log('✅ Seeding completed!');
  console.log('📧 Admin: admin@crowdaid.in / admin123');
  console.log('📧 User: demo@crowdaid.in / demo123');
  console.log('📧 Volunteer: volunteer@crowdaid.in / volunteer123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

