import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {

    const slug = params.slug;

    // get all categories
    if (slug === 'get-all') {
        try {
            const categories = await prisma.category.findMany({
                orderBy: {
                    categoryName: 'asc',
                },
            });
            return NextResponse.json({ categories: categories });
        } catch (error) {
            return NextResponse.json({ error: 'Unable to fetch categories' });
        }
    }
    // get categories with no children
    else if (slug === 'get-no-children') {
        try {
            const parentCategoryIds = await prisma.category.findMany({
                where: {
                    parentCategoryId: {
                        not: null
                    }
                },
                select: {
                    parentCategoryId: true
                }
            });

            // Extract the ids into an array
            const parentCategoryIdArray = parentCategoryIds.map(category => category.parentCategoryId);

            // Find all categories whose id is not in the list of parentCategoryIds
            const categoriesWithoutChildren = await prisma.category.findMany({
                where: {
                    id: {
                        notIn: parentCategoryIdArray
                    }
                }, orderBy: {
                    categoryName: 'asc',
                },
            });
            return NextResponse.json({ categories: categoriesWithoutChildren });
        } catch (error) {
            console.log(error);
            return NextResponse.json({ error: 'Unable to fetch categories with no children' });
        }
    }
    // get all children of a given category
    else {
        try {
            const givenCategory = await prisma.category.findUnique({
                where: { id: slug },
            });

            if (!givenCategory) {
                return NextResponse.json({ error: 'Method not allowed, or category not found' });
            }

            const categories = await prisma.category.findMany({
                where: {
                    parentCategoryId: slug,
                },
            });

            return NextResponse.json({ categories: categories });

        } catch (error) {
            return NextResponse.json({ error: 'Unable to fetch children categories' });
        }
    }

}