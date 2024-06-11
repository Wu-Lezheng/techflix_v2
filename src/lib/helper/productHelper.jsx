"use server";
import prisma from "../prisma";
import { getUserId } from "./userHelper";

export async function checkProductLiked(productId) {

    const userId = await getUserId();

    if (userId?.length > 0) {
        const isLiked = await prisma.userFavourites.findUnique({
            where: {
                userId_productId: { userId: userId, productId: productId },
            },
        });
        return isLiked ? true : false;
    } else {
        return false;
    }
}