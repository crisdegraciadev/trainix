/*
  Warnings:

  - You are about to drop the `ExercisesOnActivities` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `exerciseId` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ExercisesOnActivities" DROP CONSTRAINT "ExercisesOnActivities_activityId_fkey";

-- DropForeignKey
ALTER TABLE "ExercisesOnActivities" DROP CONSTRAINT "ExercisesOnActivities_exerciseId_fkey";

-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "exerciseId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "ExercisesOnActivities";

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
