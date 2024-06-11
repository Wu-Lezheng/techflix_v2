import LikeButton from '@/components/utils/like-button/LikeButton';
import Image from "next/image";
import Link from "next/link";
import { BsBookmarkFill } from "react-icons/bs";
import styles from "./ProductCardBg.module.css";

export default async function ProductCardBg({ product }) {

    const category = await prisma.category.findUnique({
        where: { id: product.categoryId }
    });

    let dynamicFontSize = '0.875rem';
    if (category.categoryName.length > 20) {
        dynamicFontSize = '0.75rem';
    }

    return (
        <Link href={`/category/${product.categoryId}/product/${product.id}`}>
            <div className={styles.productContainer}>
                <div className={styles.imageContainer}>
                    <Image src={product.coverImage} alt={product.productName} width={1920} height={1080} quality={100} priority className={styles.thumbnail} />
                </div>
                <div className={styles.productName}>
                    <p style={{ fontSize: product.productName.length > 20 ? '1rem' : '1.125rem' }}>{product.productName}</p>
                    <LikeButton productId={product.id} className={styles.likeButton} size={"1.125rem"} />
                </div>
                <div className={styles.categorySection} style={{ color: category.labelColor, fontSize: '1rem' }}>
                    <BsBookmarkFill style={{ display: 'block' }} />
                    <p className={styles.productCategory} style={{ fontSize: dynamicFontSize }}>{category.categoryName}</p>
                </div>
            </div>
        </Link>
    );
}
