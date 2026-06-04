const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const logs = await prisma.dailyLog.findMany({
      orderBy: { date: 'desc' },
      take: 10,
      include: {
        user: {
          select: { email: true, fullName: true }
        }
      }
    });
    console.log('Last 10 Daily Logs in DB:');
    console.log(JSON.stringify(logs, null, 2));

    const activeUsers = await prisma.user.findMany({
      select: {
        email: true,
        fullName: true,
        _count: {
          select: { dailyLogs: true, cycles: true }
        }
      },
      orderBy: {
        dailyLogs: { _count: 'desc' }
      },
      take: 10
    });
    console.log('\nTop 10 users by log count:');
    console.log(JSON.stringify(activeUsers, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
