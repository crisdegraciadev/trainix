import { Exercise, PrismaClient } from '@prisma/client';
import { TranslationKeys } from '../src/consts/translation-keys';
import { Global } from '../src/consts';
import { hashPassword } from '../src/lib/bcrypt';
import { Effect } from 'effect';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const exercises: Omit<Exercise, 'id'>[] = [
    { name: TranslationKeys.PushUp.NAME, description: TranslationKeys.PushUp.DESCRIPTION },
    { name: TranslationKeys.PullUp.NAME, description: TranslationKeys.PullUp.DESCRIPTION },
    { name: TranslationKeys.Squat.NAME, description: TranslationKeys.Squat.DESCRIPTION },
  ];

  for (const exercise of exercises) {
    try {
      await prisma.exercise.create({ data: exercise }).then();
    } catch (error) {}
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


