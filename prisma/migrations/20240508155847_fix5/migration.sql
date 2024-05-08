/*
  Warnings:

  - Added the required column `mediaType` to the `MediaFile` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- AlterTable
ALTER TABLE "MediaFile" ADD COLUMN     "mediaType" "MediaType" NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "profilePic" SET DEFAULT '/profile-images/default_profile_image.png';
