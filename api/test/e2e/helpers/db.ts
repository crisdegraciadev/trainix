import prisma from '../../../src/config/prisma';

type CleanDatabaseArgs = Partial<{
  all: boolean;
}>;

export const cleanDatabase = async ({ all }: CleanDatabaseArgs): Promise<void> => {
  const deleteActivities = prisma.activity.deleteMany();
  const deleteWorkouts = prisma.workout.deleteMany();
  const deleteExercises = prisma.exercise.deleteMany();
  const deleteUsers = all
    ? prisma.user.deleteMany()
    : prisma.user.deleteMany({
        where: {
          role: {
            not: 'admin',
          },
        },
      });

  await prisma.$transaction([deleteActivities, deleteWorkouts, deleteExercises, deleteUsers]);
};
