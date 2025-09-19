const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Running seed script...');

  const passwordHash = await bcrypt.hash('TestPassword123', 10);
  // create test user
  await prisma.user.upsert({
    where: { email: 'testuser@example.com' },
    update: {},
    create: {
      email: 'testuser@example.com',
      password: passwordHash,
    },
  });

  const sources = ['website','facebook_ads','google_ads','referral','events','other'];
  const statuses = ['new','contacted','qualified','lost','won'];

  const leads = [];
  for (let i = 0; i < 150; i++) {
    leads.push({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: `lead${i}@example.com`,
      phone: faker.phone.number(),
      company: faker.company.name(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      source: sources[Math.floor(Math.random() * sources.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      score: faker.number.int({ min: 0, max: 100 }),
      lead_value: faker.number.float({ min: 100, max: 10000 }),
      is_qualified: faker.datatype.boolean(),
    });
  }

  await prisma.lead.createMany({ data: leads, skipDuplicates: true });
  console.log('Seed complete.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
