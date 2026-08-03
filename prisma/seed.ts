import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean up existing data before seeding
  await prisma.bankTransaction.deleteMany();
  await prisma.account.deleteMany();
  const senderPwd = await bcrypt.hash('123456', 10);
  // Create Sender Account
  const sender = await prisma.account.create({
    data: {
      ownerName: 'Aung Aung',
      nrcNo: '12/MAMANA(N)123456',
      phoneNo: '0998765432',
      email: 'aungaung@gmail.com',
      password: senderPwd,
      balance: 500000.0, // Initial balance of 500,000
      status: 'ACTIVE',
    },
  });
  const receiverPwd = await bcrypt.hash('something', 10);
  // Create Receiver Account
  const receiver = await prisma.account.create({
    data: {
      ownerName: 'Kyaw Kyaw',
      nrcNo: '12/DAGANA(N)654321',
      phoneNo: '0998765433',
      email: 'kyawkyaw@gmail.com',
      password: receiverPwd,
      balance: 50000.0, // Initial balance of 50,000
      status: 'ACTIVE',
    },
  });

  console.log('✅ Accounts created successfully:');
  console.log({
    sender: {
      id: sender.id,
      name: sender.ownerName,
      balance: sender.balance.toString(),
      status: 'ACTIVE',
    },
    receiver: {
      id: receiver.id,
      name: receiver.ownerName,
      balance: receiver.balance.toString(),
      status: 'ACTIVE',
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
