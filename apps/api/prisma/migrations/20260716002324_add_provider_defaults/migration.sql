-- AlterTable
ALTER TABLE "providers" ADD COLUMN     "defaultCompensationDays" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "defaultInterestRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
ALTER COLUMN "phone" DROP NOT NULL;
