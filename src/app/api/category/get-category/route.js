import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req, res) {
    try {
        const categories = await prisma.category.findMany({
            orderBy: {
                categoryName: 'asc',
            },
        });
        return NextResponse.json({ data: categories }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Unable to fetch categories' }, { status: 500 });
    }
}