/*
  Warnings:

  - A unique constraint covering the columns `[number]` on the table `operations` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "operations" ADD COLUMN     "number" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "operations_number_key" ON "operations"("number");
