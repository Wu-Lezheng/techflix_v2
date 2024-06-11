import { getUserId } from "@/lib/helper/userHelper";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {

    const slug = params.slug;
    const userId = await getUserId();
    let liked = false;

    if (userId?.length > 0) {
        const isLiked = await prisma.userFavourites.findUnique({
            where: {
                userId_productId: { userId: userId, productId: slug },
            },
        });
        liked = isLiked ? true : false;
    }

    return NextResponse.json({ liked: liked });
}