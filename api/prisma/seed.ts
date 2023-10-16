import { PrismaClient, Role } from '@prisma/client';
import { EXERCISES } from './seeds/exercises';
import { Effect } from 'effect';
import { hashPassword } from '../src/lib/bcrypt';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const env = process.env.ENV;

  console.log({ env });

  if (env === 'e2e') {
    try {
      const userCreated = await prisma.user.create({
        data: {
          username: 'test',
          email: 'test@email.com',
          passwordHash: Effect.runSync(hashPassword({ password: '123456789' })),
          role: Role.admin,
        },
      });

      console.log({ userCreated });
    } catch (e) {
      console.log('CANNOT INSERT test USER');
    }
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
