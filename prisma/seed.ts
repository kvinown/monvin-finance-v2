import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // 1. Create a Test User
  const password = await bcrypt.hash("password123", 10);
  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      name: "Test User",
      email: "test@example.com",
      password,
    },
  });
  console.log(`User created: ${user.name}`);

  // 2. Create an initial Wallet
  let wallet = await prisma.wallet.findFirst({
    where: { userId: user.id },
  });

  if (!wallet) {
    wallet = await prisma.wallet.create({
      data: {
        name: "Main Bank Account",
        type: "BANK",
        balance: 5000000, // 5 Million IDR
        currency: "IDR",
        userId: user.id,
      },
    });
    console.log(`Wallet created: ${wallet.name}`);

    // Create some initial transactions
    await prisma.transaction.createMany({
      data: [
        {
          amount: 10000000,
          type: "INCOME",
          category: "Salary",
          description: "Monthly Salary",
          walletId: wallet.id,
          date: new Date(new Date().setMonth(new Date().getMonth() - 1)), // 1 month ago
        },
        {
          amount: 50000,
          type: "EXPENSE",
          category: "Food",
          description: "Lunch",
          walletId: wallet.id,
          date: new Date(new Date().setDate(new Date().getDate() - 2)), // 2 days ago
        },
        {
          amount: 150000,
          type: "EXPENSE",
          category: "Transport",
          description: "Gas",
          walletId: wallet.id,
          date: new Date(new Date().setDate(new Date().getDate() - 1)), // 1 day ago
        },
      ],
    });
    console.log("Transactions seeded.");
  }

  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
