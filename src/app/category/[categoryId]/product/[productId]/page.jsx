import MediaSlider from "@/components/media-slider/MediaSlider";
import EditProductModal from "@/components/modal/edit-product-modal/EditProductModal";
import ProductFeature from "@/components/product-feature/ProductFeature";
import ProductSpecs from "@/components/product-specs/ProductSpecs";
import LikeButtonLong from "@/components/utils/like-button/LikeButtonLong";
import { isAdmin } from "@/lib/helper/userHelper";
import prisma from "@/lib/prisma";
import Link from "next/link";
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

async function getTags(productId) {
    const tags = await prisma.tag.findMany({
        where: {
            products: {
                some: { productId: productId, },
            },
        },
    })

    return tags;
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

export default async function ProductPage({ params }) {

    const productId = params.productId;
    const product = await prisma.product.findUnique({
        where: { id: productId },
    });

    if (!product) {
        // TODO: add not-found
        return (
            <div>Product not found</div>
        );
    }

    const mediaFiles = await getMediaFiles(product.id);
    const category = await getCategoryName(product.categoryId);
    const tags = await getTags(product.id);
    const features = await getFeatures(product.id);
    const specs = await getSpecs(product.id);

    return (
        <div className={styles.container}>

            <MediaSlider product={product} category={category} mediaFiles={mediaFiles}></MediaSlider>

            <div className={styles.productLayout}>
                <div className={styles.productControl}>
                    <div style={{ display: 'flex', flexDirection: 'column', rowGap: '1.125rem', fontSize: '0.875rem', fontWeight: 'var(--semi-bold)' }}>
                        <LikeButtonLong productId={product.id} />
                        {await isAdmin() && (
                            <Link href="?edit-product=true">
                                <button style={{ width: '100%', font: 'inherit' }}>Edit</button>
                            </Link>
                        )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', columnGap: '0.5rem' }}>
                        <h4>Tags:</h4>
                        <div className={styles.tags}>
                            {tags.map((tag, index) => (
                                <p key={index} className={styles.tag}>{tag.tagName}</p>
                            ))}
                        </div>
                    </div>
                    <h4>Views: <span style={{ fontWeight: 'var(--medium)', fontSize: '0.875rem' }}>{product.numberOfViews}</span></h4>
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

            <EditProductModal product={product} mediaFiles={mediaFiles}></EditProductModal>
        </div>
    );
}