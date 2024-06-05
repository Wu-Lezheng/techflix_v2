export async function fetchCategoriesForProducts(products) {
    const categoryPromises = products.map(async (product) => {
        const category = await prisma.category.findUnique({
            where: { id: product.categoryId }
        });
        return { product, category };
    });
    return Promise.all(categoryPromises);
}