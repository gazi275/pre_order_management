import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.preorder.deleteMany();

  const preorders = [
    {
      name: "Multi variant 3",
      products: 1,
      preorderWhen: "out-of-stock",
      startsAt: new Date("2025-12-15T20:24:00"),
      endsAt: null,
      status: "inactive",
    },
    {
      name: "Multi variant 2",
      products: 1,
      preorderWhen: "regardless-of-stock",
      startsAt: new Date("2025-12-15T20:24:00"),
      endsAt: new Date("2025-12-15T20:27:00"),
      status: "active",
    },
    {
      name: "Multi variants 1",
      products: 1,
      preorderWhen: "regardless-of-stock",
      startsAt: new Date("2025-12-15T20:24:00"),
      endsAt: null,
      status: "active",
    },
    {
      name: "Partial payment",
      products: 1,
      preorderWhen: "regardless-of-stock",
      startsAt: new Date("2025-08-17T16:56:00"),
      endsAt: null,
      status: "active",
    },
    {
      name: "Shipping not sure",
      products: 1,
      preorderWhen: "regardless-of-stock",
      startsAt: new Date("2025-08-17T16:56:00"),
      endsAt: null,
      status: "active",
    },
    {
      name: "Full payment",
      products: 1,
      preorderWhen: "regardless-of-stock",
      startsAt: new Date("2025-08-17T16:56:00"),
      endsAt: null,
      status: "active",
    },
    {
      name: "Coming soon",
      products: 1,
      preorderWhen: "regardless-of-stock",
      startsAt: new Date("2025-12-11T04:42:00"),
      endsAt: null,
      status: "active",
    },
    {
      name: "With ends",
      products: 1,
      preorderWhen: "regardless-of-stock",
      startsAt: new Date("2025-08-14T15:59:00"),
      endsAt: null,
      status: "active",
    },
  ];

  for (const preorder of preorders) {
    await prisma.preorder.create({ data: preorder });
  }

  console.log(`✅ Seeded ${preorders.length} preorders`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
