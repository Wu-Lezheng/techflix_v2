/*
  Warnings:

  - The values [DEPLOYMENT_ENVIRONMENT] on the enum `SpecType` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[productName]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SpecType_new" AS ENUM ('OS', 'SUPPORTED_LANGUAGE', 'HARDWARE_REQUIREMENTS', 'SOFTWARE_DEPENDENCIES', 'NETWORK_REQUIREMENTS');
ALTER TABLE "Specification" ALTER COLUMN "specType" TYPE "SpecType_new" USING ("specType"::text::"SpecType_new");
ALTER TYPE "SpecType" RENAME TO "SpecType_old";
ALTER TYPE "SpecType_new" RENAME TO "SpecType";
DROP TYPE "SpecType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "MediaFile" DROP CONSTRAINT "MediaFile_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductViewed" DROP CONSTRAINT "ProductViewed_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductViewed" DROP CONSTRAINT "ProductViewed_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserFavourites" DROP CONSTRAINT "UserFavourites_productId_fkey";

-- DropForeignKey
ALTER TABLE "UserFavourites" DROP CONSTRAINT "UserFavourites_userId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Product_productName_key" ON "Product"("productName");

-- AddForeignKey
ALTER TABLE "ProductViewed" ADD CONSTRAINT "ProductViewed_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductViewed" ADD CONSTRAINT "ProductViewed_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavourites" ADD CONSTRAINT "UserFavourites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavourites" ADD CONSTRAINT "UserFavourites_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaFile" ADD CONSTRAINT "MediaFile_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
