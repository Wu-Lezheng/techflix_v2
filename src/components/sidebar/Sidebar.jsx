import NewProduct from "./add-new/new-product/NewProduct";
import prisma from "@/lib/prisma";

async function getCategories() {
    const categories = await prisma.category.findMany();
    return categories;
}

export default async function Sidebar() {

    const categories = await getCategories();

    return (
        <div>
            {categories.map(category => (
                <p>{category.categoryName}</p>
            ))}
            <NewProduct></NewProduct>
        </div>
    );
}