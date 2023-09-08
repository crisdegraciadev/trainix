-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "Muscle" AS ENUM ('CHEST', 'BACK', 'SHOULDERS', 'TRICEPS', 'BICEPS', 'CORE', 'QUADS', 'HAMSTRINGS', 'GLUTEUS', 'CALVES');

-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "difficulty" "Difficulty" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "muscles" "Muscle"[];
