import { Exercise, PrismaClient } from '@prisma/client';
import { TranslationKeys } from '../src/consts/translation.keys';

const prisma = new PrismaClient();

async function main() {
  const exercises: Omit<Exercise, 'id'>[] = [
    { name: TranslationKeys.PushUp.NAME, description: TranslationKeys.PushUp.DESCRIPTION },
    { name: TranslationKeys.PullUp.NAME, description: TranslationKeys.PullUp.DESCRIPTION },
    { name: TranslationKeys.Squat.NAME, description: TranslationKeys.Squat.DESCRIPTION },
  ];

  for (const exercise of exercises) {
    try {
      await prisma.exercise.create({ data: exercise }).then();
    } catch (error) {
      console.log('\nExercise already exists');
      console.log({ exercise });
    }
  }
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
