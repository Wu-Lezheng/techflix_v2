import ProductGallery from "@/components/product-display/product-gallery/ProductGallery";
import RecentlyViewed from "@/components/recently-viewed/RecentlyViewed";
import Sidebar from '@/components/sidebar/Sidebar';
import Topbar from "@/components/topbar/Topbar";
import { getUserId } from "@/lib/helper/userHelper";
import prisma from "@/lib/prisma";
import { Suspense } from 'react';

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
            <Topbar></Topbar>
            <ProductGallery products={products} count={3} />
            <RecentlyViewed products={recentlyViewed} count={3} />
            <Sidebar></Sidebar>
            <Suspense fallback={<p>Loading video...</p>}>
                <VideoComponent fileName="my-video.mp4" />
            </Suspense>
        </div>
    );
}

// TODO: When migrating to remote server, replace the url with the one obtained from remote database or storage, 
// and make this function async
function VideoComponent({ fileName }) {

    const url = "/videos/sample_video_2.mp4";

    return (
        <video width="320" height="240" controls preload="none" aria-label="Video player">
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    );
}