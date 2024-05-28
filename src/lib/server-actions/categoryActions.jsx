"use server"
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import prisma from "../prisma";

export async function createCategory(prevState, formData) {

    let res = { message: null, targetUrl: null };
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
        res.targetUrl = `/category/${newCategory.id}`;
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            res.message = e.message;
        } else {
            console.log(e);
            res.message = "unable to create category";
        }
    } finally {
        if (res.targetUrl) {
            redirect('/home');
        }
        return res;
    }
}