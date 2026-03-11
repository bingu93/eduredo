-- AlterTable: Course.split (train | test)
ALTER TABLE "Course" ADD COLUMN IF NOT EXISTS "split" TEXT NOT NULL DEFAULT 'train';

-- AlterTable: Choice – isTie, chosenCourseId optional
ALTER TABLE "Choice" ADD COLUMN IF NOT EXISTS "isTie" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Choice" ALTER COLUMN "chosenCourseId" DROP NOT NULL;
