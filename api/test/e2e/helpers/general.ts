import { Effect } from 'effect';
import prisma from '../../../src/config/prisma';
import { hashPassword } from '../../../src/lib/bcrypt';

export const INEXISTENT_ID = 987654321;

export const cleanDatabase = async () => {
  const deleteActivities = prisma.activity.deleteMany();
  const deleteWorkouts = prisma.workout.deleteMany();
  const deleteUsers = prisma.user.deleteMany();

  await prisma.$transaction([deleteActivities, deleteWorkouts, deleteUsers]);
};
