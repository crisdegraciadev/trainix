import { Prisma } from '@prisma/client';

const activityWithExercise = Prisma.validator<Prisma.ActivityArgs>()({
  include: { exercise: true },
});

export type ActivityWithExercise = Prisma.ActivityGetPayload<typeof activityWithExercise>;
