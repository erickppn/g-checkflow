/*
  Warnings:

  - The primary key for the `checks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `issuerName` on the `checks` table. All the data in the column will be lost.
  - The primary key for the `operations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `providers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `issuerId` to the `checks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "checks" DROP CONSTRAINT "checks_operationId_fkey";

-- DropForeignKey
ALTER TABLE "operations" DROP CONSTRAINT "operations_providerId_fkey";

-- AlterTable
ALTER TABLE "checks" DROP CONSTRAINT "checks_pkey",
DROP COLUMN "issuerName",
ADD COLUMN     "issuerId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "operationId" SET DATA TYPE TEXT,
ADD CONSTRAINT "checks_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "checks_id_seq";

-- AlterTable
ALTER TABLE "operations" DROP CONSTRAINT "operations_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "providerId" SET DATA TYPE TEXT,
ADD CONSTRAINT "operations_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "operations_id_seq";

-- AlterTable
ALTER TABLE "providers" DROP CONSTRAINT "providers_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "providers_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "providers_id_seq";

-- CreateTable
CREATE TABLE "issuers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "normalizedName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "issuers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "issuers_normalizedName_key" ON "issuers"("normalizedName");

-- AddForeignKey
ALTER TABLE "operations" ADD CONSTRAINT "operations_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checks" ADD CONSTRAINT "checks_issuerId_fkey" FOREIGN KEY ("issuerId") REFERENCES "issuers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checks" ADD CONSTRAINT "checks_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "operations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
