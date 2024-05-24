"use server"
import { Prisma } from "@prisma/client";
import { revalidateTag } from "next/cache";
import prisma from "../prisma";

export async function createCategory(prevState, formData) {

    let res = { message: null };
    const categoryName = formData.get('categoryName');
    const categoryDescription = formData.get('categoryDescription');
    const labelColor = formData.get('labelColor');
    const parentCategoryId = formData.get('parentCategoryId');

    try {
        const newCategory = await prisma.category.create({
            data: {
                categoryName: categoryName,
                categoryDescription: categoryDescription,
                labelColor: labelColor,
                parentCategoryId: parentCategoryId.length === 0 ? null : parentCategoryId,
            }
        });
        revalidateTag('categories');
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            res = { message: e.message };
        } else {
            res = { message: "unable to create category" };
        }
    } finally {
        return res;
    }
}