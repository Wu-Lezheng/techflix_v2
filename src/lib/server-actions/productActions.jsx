"use server"
import getFileExtension from "@/lib/helper/fileHelper";
import { createId } from "@paralleldrive/cuid2";
import { MediaType } from "@prisma/client";
import { mkdir, unlink, writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

        if (coverImagePath) {
            await deleteFile(coverImagePath);
        }

        res.message = error.message;
    } finally {
        if (res.redirectPath) {
            revalidatePath(res.redirectPath);
            redirect(res.redirectPath);
        }
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