/*
  Warnings:

  - You are about to drop the column `issuer` on the `checks` table. All the data in the column will be lost.
  - Added the required column `additionalDays` to the `checks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `days` to the `checks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `interest` to the `checks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `issuerName` to the `checks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `netAmount` to the `checks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalDays` to the `checks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "checks" DROP COLUMN "issuer",
ADD COLUMN     "additionalDays" INTEGER NOT NULL,
ADD COLUMN     "days" INTEGER NOT NULL,
ADD COLUMN     "interest" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "issuerName" TEXT NOT NULL,
ADD COLUMN     "netAmount" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "totalDays" INTEGER NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';
