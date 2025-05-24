import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create the class roll number ranges
  const classRanges = [
    { className: 'CEA', minRoll: 10578, maxRoll: 10641 },
    { className: 'CEB', minRoll: 10642, maxRoll: 10704 },
    { className: 'CEC', minRoll: 10705, maxRoll: 10767 },
    { className: 'MECH', minRoll: 10768, maxRoll: 10831 },
    { className: 'ECS', minRoll: 10832, maxRoll: 10894 },
    { className: 'CSE', minRoll: 10895, maxRoll: 10958 },
  ];

  for (const classRange of classRanges) {
    await prisma.classRollRange.upsert({
      where: { className: classRange.className },
      update: classRange,
      create: classRange,
    });
  }

  console.log('Database seeded with class roll number ranges');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
