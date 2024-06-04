"use server"
import getFileExtension from "@/lib/helper/fileHelper";
import { createId } from "@paralleldrive/cuid2";
import { MediaType } from "@prisma/client";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
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
            data: {
                productName, productSummary, coverImage: fileUrl, categoryId
            }
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

async function uploadFile(file, targetPath) {
    // TODO: need to change how the file is uploaded (e.g. might just call some APIs), since this is only a localhost solution
    const fileExtension = getFileExtension(file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    const id = createId();
    const fullFilePath = path.join(process.cwd(), "public" + targetPath + id + fileExtension);
    try {
        await mkdir(path.dirname(fullFilePath), { recursive: true });
        await writeFile(fullFilePath, buffer);
        return { id, fileUrl: targetPath + id + fileExtension, fullFilePath };
    } catch (error) {
        throw new Error(`Upload of ${file.name} failed: ${error.message}`);
    }
}

async function deleteFile(fullPath) {
    // TODO: call some API instead of handling this locally
    await unlink(fullPath, (e) => {
        if (e) {
            throw e;
        }
        console.log(`File at ${fullPath} is deleted`);
    });
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
    let categoryId = product.categoryId;

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