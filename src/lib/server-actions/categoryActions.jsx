"use server"
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import prisma from "../prisma";

export async function createCategory(prevState, formData) {

    let res = { message: null, targetUrl: null };
    let createdCatory = null;
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
        createdCatory = newCategory;

        // move products in parent to Others if they exist
        if (parentCategoryId) {
            const othersCategory = await prisma.category.findUnique({
                where: { categoryName: "Others" },
            });

            if (!othersCategory) {
                throw new Error("Category named Others not found");
            }

            const updatedProducts = await prisma.product.updateMany({
                where: { categoryId: parentCategoryId },
                data: { categoryId: othersCategory.id },
            });

            updatedProducts.count > 0
                ? console.log(`${updatedProducts.count} products updated successfully`)
                : console.log('No products found with the given parentCategoryId')
        }

        res.targetUrl = `/category/${newCategory.id}`;

    } catch (e) {

        // delete the newly created category when there is an error if it exists
        if (createdCatory) {
            await prisma.category.delete({
                where: { id: createdCatory.id },
            });
        }

        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            res.message = e.message;
        } else {
            console.log(e);
            res.message = "unable to create category";
        }
    } finally {
        if (res.targetUrl) {
            redirect(res.targetUrl);
        }
        return res;
    }
}