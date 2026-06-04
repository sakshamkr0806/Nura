const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedUser(email, fullName) {
  console.log(`Seeding data for ${email}...`);
  
  // 1. Ensure user exists
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        password: '$2b$10$95ebT7eYI.f42d1D75snau.4AV7H7cVMugqaajN.evQVAktH4D85bJK', // Password123!
        fullName,
        dateOfBirth: new Date('1996-08-20'),
        onboardingCompleted: true,
        currentStreak: 7,
        longestStreak: 7
      }
    });
  } else {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        onboardingCompleted: true,
        currentStreak: 7,
        longestStreak: 7
      }
    });
  }

  const userId = user.id;

  // 2. Clear old logs and cycles for this user to make it clean
  await prisma.dailyLog.deleteMany({ where: { userId } });
  await prisma.cycle.deleteMany({ where: { userId } });

  // 3. Create a cycle starting 14 days ago
  const cycleStart = new Date();
  cycleStart.setDate(cycleStart.getDate() - 14);
  cycleStart.setUTCHours(0, 0, 0, 0);

  await prisma.cycle.create({
    data: {
      userId,
      startDate: cycleStart,
    }
  });

  // 4. Generate 7 days of logs (from 6 days ago until today)
  const moods = ['Calm', 'Happy', 'Focused', 'Tired', 'Restless'];
  const symptomsList = ['Cramps', 'Bloating', 'Headache', 'Tender Breasts'];

  for (let i = 6; i >= 0; i--) {
    const logDate = new Date();
    logDate.setDate(logDate.getDate() - i);
    logDate.setUTCHours(0, 0, 0, 0);

    // Make sleep and water realistic and varied
    const sleepHours = 6.5 + Math.random() * 2; // 6.5h to 8.5h
    const waterIntake = 1000 + Math.floor(Math.random() * 4) * 500; // 1000ml to 2500ml
    const stressLevel = 1 + Math.floor(Math.random() * 3); // 1 to 3
    const energyLevel = 3 + Math.floor(Math.random() * 3); // 3 to 5
    const exerciseMinutes = Math.random() > 0.3 ? 20 + Math.floor(Math.random() * 3) * 10 : 0; // 0 or 20-40m

    // Select 1-2 random moods
    const userMoods = [
      moods[Math.floor(Math.random() * moods.length)]
    ];
    if (Math.random() > 0.5) {
      userMoods.push(moods[Math.floor(Math.random() * moods.length)]);
    }

    // Select 0-1 symptoms
    const userSymptoms = [];
    if (Math.random() > 0.6) {
      userSymptoms.push(symptomsList[Math.floor(Math.random() * symptomsList.length)]);
    }

    // If it was 14 days ago, it was a Period Day
    if (i === 14) {
      userSymptoms.push('Period Day');
    }

    await prisma.dailyLog.create({
      data: {
        userId,
        date: logDate,
        sleepHours,
        waterIntake,
        stressLevel,
        energyLevel,
        exerciseMinutes,
        moods: [...new Set(userMoods)],
        symptoms: [...new Set(userSymptoms)],
        notes: `Daily check-in for day -${i}. Feeling relatively balanced.`,
        nutritionNotes: 'Ate balanced meals today.'
      }
    });
  }

  console.log(`Successfully seeded ${email}!`);
}

async function main() {
  try {
    await seedUser('abc.user@gmail.com', 'Abc User');
    await seedUser('janedoe@example.com', 'Jane Doe');
    await seedUser('freshuser789@gmail.com', 'Fresh User');
  } catch (e) {
    console.error('Seeding failed:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
