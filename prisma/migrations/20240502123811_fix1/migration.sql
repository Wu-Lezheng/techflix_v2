/*
  Warnings:

  - You are about to drop the column `fileType` on the `MediaFile` table. All the data in the column will be lost.
  - The primary key for the `ProductView` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ProductView` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ProductView_userId_productId_key";

-- AlterTable
ALTER TABLE "MediaFile" DROP COLUMN "fileType";

-- AlterTable
ALTER TABLE "ProductView" DROP CONSTRAINT "ProductView_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "ProductView_pkey" PRIMARY KEY ("userId", "productId");

-- DropEnum
DROP TYPE "FileType";
