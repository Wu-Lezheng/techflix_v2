import prisma from "@/lib/prisma";
import Image from "next/image";
import { motion } from "framer-motion";
import { BsBookmarkFill } from "react-icons/bs";
import styles from "./ProductCardBg.module.css"

async function ProductCardBg({ product }) {

    const category = await prisma.category.findUnique({
        where: { id: product.categoryId },
    })

    let dynamicFontSize = '0.875rem';

    if (category.categoryName.length > 20) {
        dynamicFontSize = '0.75rem';
    }

    return (
        <div className={styles.productContainer}>
            <div className={styles.imageContainer}>
                <Image src={product.coverImage} alt={product.productName} fill sizes='99vw' quality={100} priority className={styles.thumbnail}></Image>
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