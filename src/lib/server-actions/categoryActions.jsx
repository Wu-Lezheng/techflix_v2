"use server"
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import prisma from "../prisma";

async function moveProductsInCategory(categoryId) {
    const othersCategory = await prisma.category.findUnique({
        where: { categoryName: "Others" },
    });

    if (!othersCategory) {
        throw new Error("Category named Others not found");
    }

    const updatedProducts = await prisma.product.updateMany({
        where: { categoryId: categoryId },
        data: { categoryId: othersCategory.id },
    });

    revalidatePath(`/category/${othersCategory.id}`);
    updatedProducts.count > 0
        ? console.log(`${updatedProducts.count} products updated successfully`)
        : console.log('No products found with the given parentCategoryId')

    return updatedProducts;
}

export async function createCategory(formData) {

    let res = { message: null, targetUrl: null };
    let createdCategory = null;
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
        createdCategory = newCategory;

        // move products in parent to Others if they exist
        if (parentCategoryId?.length > 0) {
            const updatedProducts = await moveProductsInCategory(parentCategoryId);
        }

        res.targetUrl = `/category/${newCategory.id}`;

    } catch (e) {

        // delete the newly created category when there is an error if it exists
        if (createdCategory) {
            await prisma.category.delete({
                where: { id: createdCategory.id },
            });
        }

        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            res.message = e.message;
        } else {
            console.log(e);
            res.message = "unable to create category";
        }
    } finally {
        return res;
    }
}

export async function deleteCategory(category) {

    let res = { message: null, targetUrl: null };

    try {
        // if it has products, move them to Others
        const updatedProducts = await moveProductsInCategory(category.id);

        // if it has children, update their parents to its parent, but this seems to be redundant in current category hierarchy
        // const updatedChildren = await prisma.category.updateMany({
        //     where: { parentCategoryId: category.id },
        //     data: { parentCategoryId: category.parentCategoryId },
        // });

        // delete the category
        const deletedCategory = await prisma.category.delete({
            where: { id: category.id },
        });

        res.targetUrl = '/home';

    } catch (e) {
        res.message = e.message;
    } finally {
        return res;
    }

}

export async function updateCategory(categoryId, formData) {
    let res = { message: null, targetUrl: null };
    const categoryName = formData.get('categoryName');
    const categoryDescription = formData.get('categoryDescription');
    const labelColor = formData.get('labelColor');
    const parentCategoryId = formData.get('parentCategoryId');

    try {
        // update category
        const updatedCategory = await prisma.category.update({
            where: { id: categoryId },
            data: { categoryName, categoryDescription, labelColor, parentCategoryId: parentCategoryId.length === 0 ? null : parentCategoryId },
        });

        // move products in new parent to Others if they exist
        if (parentCategoryId?.length > 0) {
            const updatedProducts = await moveProductsInCategory(parentCategoryId);
        }

        res.targetUrl = `/category/${categoryId}`
        revalidatePath(res.targetUrl);
    } catch (e) {
        //TODO: restore to the original category?
        res.message = e.message;
    } finally {
        return res;
    }
}