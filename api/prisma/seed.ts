import { PrismaClient, Role } from '@prisma/client';
import { EXERCISES } from './seeds/exercises';
import { Effect } from 'effect';
import { hashPassword } from '../src/lib/bcrypt';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const env = process.env.ENV;

  console.log({ env });
  if (env === 'test') {
    try {
      await prisma.user.create({
        data: {
          username: 'test',
          email: 'test@email.com',
          passwordHash: Effect.runSync(hashPassword({ password: '123456789' })),
          role: Role.admin,
        },
      });
    } catch (e) {}
  }

  Promise.all(
    EXERCISES.map(async (exercise) => {
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
