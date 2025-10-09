-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "companies_isActive_idx" ON "companies"("isActive");
