const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const usersCount = await prisma.user.count();
    const logsCount = await prisma.dailyLog.count();
    const cyclesCount = await prisma.cycle.count();
    console.log('Database Status:');
    console.log(`Users: ${usersCount}`);
    console.log(`Daily Logs: ${logsCount}`);
    console.log(`Cycles: ${cyclesCount}`);

    const users = await prisma.user.findMany({
      select: { id: true, email: true, fullName: true }
    });
    console.log('Users detail:', JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error connecting to the database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
