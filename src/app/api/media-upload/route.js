import path from "path";
import prisma from "@/lib/prisma";
import { createId } from "@paralleldrive/cuid2";
import getFileExtension from "@/lib/helper/fileHelper";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";

export async function POST(req, res) {

    const formData = await req.formData();
    const file = formData.get("file");
    const fileExtension = getFileExtension(file.name);
    const filePath = formData.get("filePath");
    if (!file) {
        return NextResponse.json({ error: "No file received." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const id = createId();

    try {
        await writeFile(
            path.join(process.cwd(), filePath + id + fileExtension),
            buffer
        );

        return NextResponse.json({ Message: "Success", status: 201 })
    } catch (error) {
        console.log("Error occurred ", error);
        return NextResponse.json({ Message: "Failed", status: 500 });
    }

}