-- DropForeignKey
ALTER TABLE "checks" DROP CONSTRAINT "checks_operationId_fkey";

-- AddForeignKey
ALTER TABLE "checks" ADD CONSTRAINT "checks_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "operations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
