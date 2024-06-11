"use client"
import LikeButton from '@/components/utils/like-button/LikeButton';
import { formatDate, formatViews } from '@/lib/helper/formatter';
import Image from 'next/image';
import Link from 'next/link';
import styles from "./ProductCard.module.css";

const ProductCard = ({ product }) => {

    const formattedDate = formatDate(product.createdAt);
    const formattedViews = formatViews(product.numberOfViews);

    return (
        <Link href={`${product.categoryId}/product/${product.id}`}>
            <div className={styles.productContainer}>
                <div className={styles.imageContainer}>
                    <Image src={product.coverImage} alt={product.productName} width={1920} height={1080} className={styles.thumbnail} quality={100} priority></Image>
                    <LikeButton productId={product.id} className={styles.likeButton} size={"1.125rem"} />
                </div>
                <div className={styles.productInfo}>
                    <p className={styles.productName}>{product.productName}</p>
                    <div className={styles.productData}>
                        <p className={styles.uploadDate}>{formattedDate}</p>
                        <p className={styles.views}>{`${formattedViews} views`}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default ProductCard;