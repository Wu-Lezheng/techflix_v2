"use server"
import getFileExtension from "@/lib/helper/fileHelper";
import { createId } from "@paralleldrive/cuid2";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import prisma from "../prisma";

export async function createProduct(formData) {

    const productName = formData.get('productName');
    const productSummary = formData.get('productSummary');
    const categoryId = formData.get('categoryId');
    const coverImage = formData.get('coverImage');
    let CoverImagePath;
    let createdProduct;

    try {
        // TODO: change the target path to somewhere remote
        const { fileUrl, fullFilePath } = await uploadFile(coverImage, "/cover-images/");
        CoverImagePath = fullFilePath;

        createdProduct = await prisma.product.create({
            data: {
                productName, productSummary, coverImage: fileUrl, categoryId
            }
        });
    } catch (error) {
        return Response.json({ message: error.message });
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
