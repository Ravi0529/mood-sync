/*
  Warnings:

  - Changed the type of `mood` on the `MoodEntry` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MoodType" AS ENUM ('HAPPY', 'EXCITED', 'NEUTRAL', 'TIRED', 'SAD');

-- DropForeignKey
ALTER TABLE "MoodEntry" DROP CONSTRAINT "MoodEntry_userId_fkey";

-- AlterTable
ALTER TABLE "MoodEntry" DROP COLUMN "mood",
ADD COLUMN     "mood" "MoodType" NOT NULL;

-- AddForeignKey
ALTER TABLE "MoodEntry" ADD CONSTRAINT "MoodEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
