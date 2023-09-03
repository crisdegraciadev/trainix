import prisma from '../../../src/config/prisma';

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
