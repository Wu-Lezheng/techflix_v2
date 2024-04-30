import React from 'react';
import Image from 'next/image';
import { formatDate, formatViews } from '@/lib/helper/formatter';

import { AiOutlineHeart } from "react-icons/ai";
import styles from "./ProductCard.module.css"

const ProductCard = ({ product }) => {

    const formattedDate = formatDate(product.createdAt);
    const formattedViews = formatViews(product.numberOfViews);

    return (
        <div className={styles.productContainer}>
            <div className={styles.imageContainer}>
                <Image src={product.coverImage} alt={product.productName} fill sizes='99vw' className={styles.thumbnail} quality={100} priority={true}></Image>
                <div className={styles.loveButton}>
                    <AiOutlineHeart size={18} />
                </div>
            </div>
            <div className={styles.productInfo}>
                <p className={styles.productName}>{product.productName}</p>
                <div className={styles.productData}>
                    <p className={styles.uploadDate}>{formattedDate}</p>
                    <p className={styles.views}>{`${formattedViews} views`}</p>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;