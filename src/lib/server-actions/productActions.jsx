"use server"
import { MediaType } from "@prisma/client";
import path from "path";
import { deleteFile, uploadFile } from "../helper/fileHelper";
import prisma from "../prisma";

export async function createProduct(formData) {

    let res = { message: null, redirectPath: null };

    const productName = formData.get('productName');
    const productSummary = formData.get('productSummary');
    const categoryId = formData.get('categoryId');
    const coverImage = formData.get('coverImage');
    let coverImagePath;
    let createdProduct;

    const mediaFiles = formData.getAll("mediaFiles");
    let mediaFilePaths;

    try {
        // TODO: change the target path to somewhere remote
        const { fileUrl, fullFilePath } = await uploadFile(coverImage, "/cover-images/");
        coverImagePath = fullFilePath;

        createdProduct = await prisma.product.create({
            data: { productName, productSummary, coverImage: fileUrl, categoryId }
        });

        // create product media files
        if (mediaFiles?.length > 0) {
            mediaFilePaths = await uploadMediaFiles(mediaFiles, createdProduct.id);
        }

        res.redirectPath = `/category/${categoryId}`;

    } catch (error) {
        console.log(error.message);

        // perform clean-ups
        if (coverImagePath) {
            await deleteFile(coverImagePath);
        }

        if (createdProduct) {
            await prisma.product.delete({
                where: { id: createdProduct.id }
            })
        }

        if (mediaFilePaths?.length > 0) {
            await Promise.all(mediaFilePaths.map(async (path) => {
                await deleteFile(path);
            }))
        }

        res.message = error.message;
    } finally {
        return res;
    }

}

async function uploadMediaFiles(mediaFiles, productId) {

    let outputFilePaths = [];

    try {
        await Promise.all(mediaFiles.map(async (file) => {
            // TODO: as this is a localhost solution, plase change how upload path is handled
            const targetPath = file.type.startsWith('image/') ? "/images/" : "/videos/";
            const mediaType = file.type.startsWith('image/') ? MediaType.IMAGE : MediaType.VIDEO;
            const { fileUrl, fullFilePath } = await uploadFile(file, targetPath);
            outputFilePaths.push(fullFilePath);
            await prisma.mediaFile.create({
                data: { fileName: file.name, filePath: fileUrl, mediaType: mediaType, productId: productId }
            });
        }));
    } catch (e) {
        throw new Error(e.message);
    } finally {
        return outputFilePaths;
    }

}

export async function deleteProduct(product) {
    let res = { message: null, redirectPath: null };
    const categoryId = product.categoryId;

    try {
        // get all file paths
        const mediaFilePaths = await prisma.mediaFile.findMany({
            where: { productId: product.id, },
            select: { filePath: true, },
        });
        const allFilePaths = [...mediaFilePaths, { filePath: product.coverImage }];

        // delete the product
        const deletedProduct = await prisma.product.delete({
            where: { id: product.id }
        });

        // TODO: delete file from local machine, change to some API
        await Promise.all(allFilePaths.map(async ({ filePath }) => {
            const fullPath = path.join(process.cwd(), "public" + filePath);
            await deleteFile(fullPath);
        }));

        res.redirectPath = `/category/${categoryId}`;
    } catch (e) {
        res.message = e.message;
    } finally {
        return res;
    }
}

export async function updateProduct(product, formData) {

    let res = { message: null, redirectPath: null };
    const oldCover = product.coverImage;
    const oldCategoryId = product.categoryId;

    const productName = formData.get('productName');
    const productSummary = formData.get('productSummary');
    const categoryId = formData.get('categoryId');
    const coverImage = formData.get('coverImage');

    const mediaFiles = formData.getAll("mediaFiles");

    // TODO: change how file upload and deletion are handleed in the case of remote
    try {

        // upload the new cover image
        const { fileUrl, fullFilePath } = await uploadFile(coverImage, "/cover-images/");
        // update the product record
        const updatedProduct = await prisma.product.update({
            where: { id: product.id },
            data: { productName, productSummary, coverImage: fileUrl, categoryId: categoryId }
        });
        // delete the old cover image 
        await deleteFile(path.join(process.cwd(), "public" + oldCover));

        // find the relative paths of all old files
        const oldMediaPaths = await prisma.mediaFile.findMany({
            where: { productId: product.id },
            select: { filePath: true }
        });
        // delete all media file records in the database
        const deleteCount = await prisma.mediaFile.deleteMany({
            where: { productId: product.id }
        });
        // delete all the media files in the storage
        await Promise.all(oldMediaPaths.map(async ({ filePath }) => {
            const fullPath = path.join(process.cwd(), "public" + filePath);
            await deleteFile(fullPath);
        }))
        // upload new media files
        if (mediaFiles?.length > 0) {
            const mediaFilePaths = await uploadMediaFiles(mediaFiles, product.id);
        }

        res.redirectPath = categoryId === oldCategoryId ? `/category/${oldCategoryId}/product/${product.id}` : `/category/${categoryId}`;

    } catch (e) {
        // TODO: restore to the original data if the update fails
        res.message = e.message;
    } finally {
        return res;
    }
}