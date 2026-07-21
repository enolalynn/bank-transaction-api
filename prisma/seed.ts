import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean up existing data before seeding
  await prisma.bankTransaction.deleteMany();
  await prisma.account.deleteMany();

  // Create Sender Account
  const sender = await prisma.account.create({
    data: {
      ownerName: 'Aung Aung',
      nrcNo: '12/MAMANA(N)123456',
      balance: 500000.0, // Initial balance of 500,000
    },
  });

  // Create Receiver Account
  const receiver = await prisma.account.create({
    data: {
      ownerName: 'Kyaw Kyaw',
      nrcNo: '12/DAGANA(N)654321',
      balance: 50000.0, // Initial balance of 50,000
    },
  });

  console.log('✅ Accounts created successfully:');
  console.log({
    sender: {
      id: sender.id,
      name: sender.ownerName,
      balance: sender.balance.toString(),
    },
    receiver: {
      id: receiver.id,
      name: receiver.ownerName,
      balance: receiver.balance.toString(),
    },
  });
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
