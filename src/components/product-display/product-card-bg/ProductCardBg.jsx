"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BsBookmarkFill } from "react-icons/bs";
import styles from "./ProductCardBg.module.css";

function ProductCardBg({ product, category }) {

    let dynamicFontSize = '0.875rem';

    if (category.categoryName.length > 20) {
        dynamicFontSize = '0.75rem';
    }

    const router = useRouter();
    const handleClick = () => {
        const targetPath = `/category/${product.categoryId}/product/${product.id}`;
        router.push(targetPath);
    };

    return (
        <div className={styles.productContainer} onClick={handleClick}>
            <div className={styles.imageContainer}>
                <Image src={product.coverImage} alt={product.productName} width={1920} height={1080} quality={100} priority className={styles.thumbnail} />
            </div>
            <p className={styles.productName}>{product.productName}</p>
            <div className={styles.categorySection} style={{ color: category.labelColor, fontSize: '1rem' }}>
                <BsBookmarkFill style={{ display: 'block' }} />
                <p className={styles.productCategory} style={{ fontSize: dynamicFontSize }}>{category.categoryName}</p>
            </div>
        </div>
    );
}

export default ProductCardBg