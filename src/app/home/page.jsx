import ProductGallery from "@/components/product-display/product-gallery/ProductGallery";
import RecentlyViewed from "@/components/recently-viewed/RecentlyViewed";
import { getUserId } from "@/lib/helper/userHelper";
import prisma from "@/lib/prisma";

async function getAllProducts() {

    const products = await prisma.product.findMany();
    return products;
}

async function getRecentlyViewed(userId) {

    if (!userId || userId.trim().length === 0) {
        return null;
    }

    const recentViews = await prisma.productViewed.findMany({
        where: { userId: userId },
        orderBy: {
            viewedAt: 'desc',
        },
    });

    const products = [];
    for (let recentView of recentViews) {
        const product = await prisma.product.findUnique({
            where: { id: recentView.productId },
        });
        products.push(product);
    }

    return products;

}

export default async function Home() {

    const products = await getAllProducts();
    const userId = await getUserId();
    const recentlyViewed = await getRecentlyViewed(userId);

    return (
        <div className="container" style={{ rowGap: '3rem' }}>
            <ProductGallery products={products} count={3} />
            <RecentlyViewed products={recentlyViewed} count={3} />
        </div>
    );
}
