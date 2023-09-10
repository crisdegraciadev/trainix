import { Difficulty, Muscle, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main(): Promise<void> {
  const data = [
    {
      name: 'Explosive Assisted Band Pull Up',
      description: 'Perform a high pull up until your chest pass the bar with a resistance band.',
      muscles: [Muscle.biceps, Muscle.back],
      difficulty: Difficulty.hard,
    },
    {
      name: 'Pike Push Up',
      description: 'Push Up with a lot of inclination to ensure that shoulders are working.',
      muscles: [Muscle.triceps, Muscle.shoulders],
      difficulty: Difficulty.medium,
    },
    {
      name: 'Assisted Band Muscle Up',
      description: 'Perform a muscle up with a resistance band.',
      muscles: [Muscle.biceps, Muscle.back, Muscle.chest, Muscle.triceps],
      difficulty: Difficulty.medium,
    },
    {
      name: 'Advanced Tucked Front Lever',
      description: 'Front lever progression where legs retracted.',
      muscles: [Muscle.biceps, Muscle.back, Muscle.abs],
      difficulty: Difficulty.medium,
    },
    {
      name: 'Pull Up',
      description: 'Vertical pulling exercise.',
      muscles: [Muscle.biceps, Muscle.back],
      difficulty: Difficulty.easy,
    },
    {
      name: 'Chest Bar Dip',
      description: 'Perform a dip in a straight bar.',
      muscles: [Muscle.chest, Muscle.triceps],
      difficulty: Difficulty.medium,
    },
    {
      name: 'Australian Rows',
      description: 'Horizontal pulling exercise.',
      muscles: [Muscle.biceps, Muscle.back],
      difficulty: Difficulty.easy,
    },
    {
      name: 'Explosive Push Up',
      description: 'Perform a normal push up raising hands of the ground.',
      muscles: [Muscle.chest, Muscle.triceps],
      difficulty: Difficulty.medium,
    },
    {
      name: 'Knee Raises on Parallel Bar',
      description: 'Knee raises on parallel bar.',
      muscles: [Muscle.abs],
      difficulty: Difficulty.easy,
    },
    {
      name: 'Knee L-Sit on Parallel Bar',
      description: 'L-sit progression with knees on parallel bar.',
      muscles: [Muscle.abs],
      difficulty: Difficulty.easy,
    },
    {
      name: 'Rolling Pistol Squat',
      description: 'Perform a pistol squat rolling from the ground and try to stand up.',
      muscles: [Muscle.quads, Muscle.gluteus],
      difficulty: Difficulty.hard,
    },
    {
      name: 'Assisted Pistol Squat',
      description: 'Perform a pistol squat with assistance.',
      muscles: [Muscle.quads, Muscle.gluteus],
      difficulty: Difficulty.medium,
    },
  ];

  Promise.all(
    data.map(async (exercise) => {
      try {
        await prisma.exercise.create({ data: exercise });
      } catch (e) {}
    })
  );
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
