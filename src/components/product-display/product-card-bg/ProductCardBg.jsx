import prisma from "@/lib/prisma";
import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./ProductCardBg.module.css"

async function ProductCardBg({ product }) {

    const category = await prisma.category.findUnique({
        where: { id: product.categoryId },
    })

    return (
        <div className={styles.productContainer}>
            <div className={styles.imageContainer}>
                <Image src={product.coverImage} alt={product.productName} fill sizes='99vw' quality={100} priority className={styles.thumbnail}></Image>
            </div>
            <p>{product.productName}</p>
            <p>{category.categoryName}</p>
        </div>
    );
}

export default ProductCardBg