-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateEnum
CREATE TYPE "SpecType" AS ENUM ('OS', 'SUPPORTED_LANGUAGE', 'HARDWARE_REQUIREMENTS', 'SOFTWARE_DEPENDENCIES', 'NETWORK_REQUIREMENTS', 'DEPLOYMENT_ENVIRONMENT');

-- CreateEnum
CREATE TYPE "FeatureLayout" AS ENUM ('SPLIT', 'STACK', 'IMAGE_SPLIT', 'IMAGE_STACK');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profilePic" TEXT NOT NULL DEFAULT '/images/default-profile-image.jpg',
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,
    "categoryDescription" TEXT NOT NULL,
    "labelColor" TEXT NOT NULL,
    "parentCategoryId" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "productSummary" TEXT NOT NULL,
    "numberOfViews" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "coverImage" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductView" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFavourites" (
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "UserFavourites_pkey" PRIMARY KEY ("userId","productId")
);

-- CreateTable
CREATE TABLE "MediaFile" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileType" "FileType" NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "MediaFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "tagName" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductTag" (
    "productId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "ProductTag_pkey" PRIMARY KEY ("productId","tagId")
);

-- CreateTable
CREATE TABLE "Keyword" (
    "value" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "Keyword_pkey" PRIMARY KEY ("value","productId")
);

-- CreateTable
CREATE TABLE "Specification" (
    "id" TEXT NOT NULL,
    "specType" "SpecType" NOT NULL,
    "value" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "Specification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feature" (
    "id" TEXT NOT NULL,
    "featureTitle" TEXT NOT NULL,
    "featureDescription" TEXT NOT NULL,
    "featureImage" TEXT,
    "layout" "FeatureLayout" NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Category_categoryName_key" ON "Category"("categoryName");

-- CreateIndex
CREATE UNIQUE INDEX "Category_labelColor_key" ON "Category"("labelColor");

-- CreateIndex
CREATE UNIQUE INDEX "ProductView_userId_productId_key" ON "ProductView"("userId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "MediaFile_filePath_key" ON "MediaFile"("filePath");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_tagName_key" ON "Tag"("tagName");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentCategoryId_fkey" FOREIGN KEY ("parentCategoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductView" ADD CONSTRAINT "ProductView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductView" ADD CONSTRAINT "ProductView_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavourites" ADD CONSTRAINT "UserFavourites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavourites" ADD CONSTRAINT "UserFavourites_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaFile" ADD CONSTRAINT "MediaFile_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductTag" ADD CONSTRAINT "ProductTag_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductTag" ADD CONSTRAINT "ProductTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Keyword" ADD CONSTRAINT "Keyword_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Specification" ADD CONSTRAINT "Specification_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feature" ADD CONSTRAINT "Feature_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
