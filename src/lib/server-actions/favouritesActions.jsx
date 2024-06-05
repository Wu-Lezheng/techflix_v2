"use server";
import { getUserId } from "../helper/userHelper";
import prisma from "../prisma";

export async function addToFavourites(productId) {
    let res = { message: "You need to sign in first", result: false };
    const userId = await getUserId();
    if (!userId || userId.length <= 0) {
        return res;
    }
    let addedProduct;
    console.log(userId);

    try {

        addedProduct = await prisma.userFavourites.create({
            data: { userId: userId, productId: productId }
        });
        res.message = "Added to favourites";
        res.result = true;
        return res;

    } catch (e) {
        res.message = "Failed to add to favourites";
        return res;
    }
}

export async function removeFromFavourites(productId) {
    let res = { message: "You need to sign in first", result: true };
    const userId = await getUserId();
    if (!userId || userId.length <= 0) {
        return res;
    }
    let deletedProduct;

    try {

        deletedProduct = await prisma.userFavourites.delete({
            where: {
                userId_productId: { userId: userId, productId: productId },
            },
        });
        res.message = "Removed from favourites";
        res.result = false;
        return res;

    } catch (e) {
        res.message = "Failed to remove from favourites";
        return res;
    }
}