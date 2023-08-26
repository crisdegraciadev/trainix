import { Effect } from 'effect';
import prisma from '../../../src/config/prisma';
import { hashPassword } from '../../../src/lib/bcrypt';

export const createAdmin = async (): Promise<void> => {
  await prisma.user.create({
    data: {
      username: 'admin',
      passwordHash: Effect.runSync(hashPassword({ password: 'admin' })),
      role: 'ADMIN',
    },
  });
};

type CleanDatabaseArgs = Partial<{
  all: boolean;
}>;

export const cleanDatabase = async ({ all }: CleanDatabaseArgs): Promise<void> => {
  const deleteActivities = prisma.activity.deleteMany();
  const deleteWorkouts = prisma.workout.deleteMany();
  const deleteUsers = all
    ? prisma.user.deleteMany()
    : prisma.user.deleteMany({
        where: {
          role: {
            not: 'ADMIN',
          },
        },
      });

  await prisma.$transaction([deleteActivities, deleteWorkouts, deleteUsers]);
};
