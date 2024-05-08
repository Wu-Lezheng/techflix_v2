import MediaSlider from "@/components/media-slider/MediaSlider";
import Topbar from "@/components/topbar/Topbar";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import styles from './page.module.css';

async function getMediaFiles(productId) {
    const mediaFiles = await prisma.mediaFile.findMany({
        where: { productId: productId },
    });

    return mediaFiles;
}

async function getCategoryName(categoryId) {
    const category = await prisma.category.findUnique({
        where: { id: categoryId },
    });

    return category;
}

export default async function CategoryPage({ params }) {

    const productId = params.productId;
    const product = await prisma.product.findUnique({
        where: { id: productId },
    });

    if (!product) {
        redirect('/not-found');
    }

    const mediaFiles = await getMediaFiles(product.id);
    const category = await getCategoryName(product.categoryId);

    return (
        <div className={styles.container}>
            <Topbar></Topbar>
            <MediaSlider product={product} category={category} mediaFiles={mediaFiles}></MediaSlider>
        </div>
    );
}