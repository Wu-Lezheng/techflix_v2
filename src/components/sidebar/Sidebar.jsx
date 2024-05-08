import prisma from "@/lib/prisma";
import Link from "next/link";
import NewProduct from "./add-new/new-product/NewProduct";

async function getCategories() {
    const categories = await prisma.category.findMany();
    return categories;
}

export default async function Sidebar() {

    const categories = await getCategories();

    return (
        <div>
            {categories.map(category => (
                <div>
                    <Link href={`/category/${category.id}`}>{category.categoryName}</Link>
                </div>
            ))}
            <NewProduct></NewProduct>
        </div>
    );
}