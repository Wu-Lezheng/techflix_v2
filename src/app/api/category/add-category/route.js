import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(req) {

    let res = { message: null, targetUrl: null };

    try {
        const data = await req.formData();
        const categoryName = data.get('categoryName');
        const categoryDescription = data.get('categoryDescription');
        const labelColor = data.get('labelColor');
        const parentCategoryId = data.get('parentCategoryId');
        const newCategory = await prisma.category.create({
            data: {
                categoryName: categoryName,
                categoryDescription: categoryDescription,
                labelColor: labelColor,
                parentCategoryId: parentCategoryId.length === 0 ? null : parentCategoryId,
            }
        });
        res.targetUrl = `/category/${newCategory.id}`;

    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            res.message = e.message;
        } else {
            res.message = "unable to create category";
        }
    } finally {
        return Response.json(res);
    }
}