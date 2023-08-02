import prisma from '../../../src/config/prisma';

export const deleteAllWorkouts = async () => {
  const deleteWorkouts = prisma.workout.deleteMany();
  await prisma.$transaction([deleteWorkouts]);
};
