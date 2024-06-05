import LikeButton from '@/components/utils/LikeButton';
import { formatDate, formatViews } from '@/lib/helper/formatter';
import { checkProductLiked } from '@/lib/helper/productHelper';
import Image from 'next/image';
import Link from 'next/link';
import styles from "./ProductCard.module.css";

const ProductCard = async ({ product, liked }) => {

    const formattedDate = formatDate(product.createdAt);
    const formattedViews = formatViews(product.numberOfViews);

    if (liked === null || liked === undefined) {
        liked = await checkProductLiked(product.id);
    }

    return (
        <Link href={`${product.categoryId}/product/${product.id}`}>
            <div className={styles.productContainer}>
                <div className={styles.imageContainer}>
                    <Image src={product.coverImage} alt={product.productName} width={1920} height={1080} className={styles.thumbnail} quality={100} priority={true}></Image>
                    <LikeButton productId={product.id} className={styles.likeButton} size={"1.125rem"} liked={liked} />
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