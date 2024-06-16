import { createId } from "@paralleldrive/cuid2";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

export function getFileExtension(fileName) {
    const dotIndex = fileName.lastIndexOf('.');
    if (dotIndex !== -1 && dotIndex !== 0 && dotIndex !== fileName.length - 1) {
        return fileName.substring(dotIndex);
    } else {
        console.error('The file does not have any extension');
        return '';
    }
}

export async function uploadFile(file, targetPath, uploadName) {
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

export async function deleteFile(fullPath) {
    // TODO: call some API instead of handling this locally
    await unlink(fullPath, (e) => {
        if (e) {
            throw e;
        }
        console.log(`File at ${fullPath} is deleted`);
    });
}