import MediaSlider from "@/components/media-slider/MediaSlider";
import ProductFeature from "@/components/product-feature/ProductFeature";
import ProductSpecs from "@/components/product-specs/ProductSpecs";
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

async function getFeatures(productId) {
    const features = await prisma.feature.findMany({
        where: { productId: productId },
    });

    return features;
}

async function getSpecs(productId) {
    const specs = await prisma.specification.findMany({
        where: { productId: productId },
    });

    return specs;
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
    const features = await getFeatures(product.id);
    const specs = await getSpecs(product.id);

    return (
        <div className={styles.container}>
            <Topbar></Topbar>
            <MediaSlider product={product} category={category} mediaFiles={mediaFiles}></MediaSlider>
            <div className={styles.productLayout}>
                <div className={styles.productControl}>
                    <button>Add to favourites</button>
                    <button>Edit</button>
                    <h4>Tags:</h4>
                    <h4>{`Views: ${product.numberOfViews}`}</h4>
                </div>
                <div className={styles.productDetails}>
                    {
                        features.map((feature, index) => (
                            <ProductFeature key={index} feature={feature}></ProductFeature>
                        ))
                    }
                    {specs.length !== 0 && <ProductSpecs specs={specs}></ProductSpecs>}
                </div>
            </div>
        </div>
    );
}