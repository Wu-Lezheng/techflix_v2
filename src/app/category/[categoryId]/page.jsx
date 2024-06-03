import EditCategoryModal from "@/components/modal/edit-category-modal/EditCategoryModal";
import ProductCard from "@/components/product-display/product-card/ProductCard";
import Topbar from "@/components/topbar/Topbar";
import { formatParagraph } from "@/lib/helper/formatter";
import { isAdmin } from "@/lib/helper/userHelper";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import styles from "./page.module.css";

async function getProducts(categoryId) {

    const products = await prisma.product.findMany({
        where: { categoryId: categoryId },
    });

    return products;
}

const SortButton = ({ buttonName, sortFunction }) => {
    return (
        <button className={styles.sortButton} onClick={sortFunction}>{buttonName}</button>
    );
};

export default async function CategoryPage({ params }) {

    const categoryId = params.categoryId;
    const category = await prisma.category.findUnique({
        where: { id: categoryId },
    });

    if (!category) {
        redirect('/not-found');
    }

    const products = await getProducts(categoryId);

    return (
        <div className="container">
            <Topbar></Topbar>

            <div className={styles.summary}>
                <div className={styles.info}>
                    <h1>{category.categoryName}</h1>
                    <div className={styles.description}>
                        {formatParagraph(category.categoryDescription)}
                    </div>
                </div>
                <div className={styles.databoxes}>
                    <div>
                        <h2 className={styles.dataValue}>{products.length}</h2>
                        <p className={styles.dataName}>Products</p>
                    </div>
                    <div>
                        <h2 className={styles.dataValue}>{products.reduce((total, product) => total + product.numberOfViews, 0)}</h2>
                        <p className={styles.dataName}>Views</p>
                    </div>
                    {
                        await isAdmin() && category.categoryName !== "Others" && (
                            <Link href="?edit=true">
                                <button className={styles.editButton}>Edit</button>
                            </Link>
                        )
                    }
                </div>
            </div>

            <hr className="gradientDivider" />

            <div className={styles.sortSection}>
                <h2 style={{ fontSize: '1.25rem' }}>Sort by</h2>
                <div className={styles.buttonGroup}>
                    <SortButton buttonName='Name'></SortButton>
                    <SortButton buttonName='Upload Date'></SortButton>
                    <SortButton buttonName='Views'></SortButton>
                </div>
            </div>

            <div className={styles.productCards}>
                {
                    Array.isArray(products) && products.length > 0
                        ? products.map(product => (
                            <ProductCard product={product} key={product.id} />
                        ))
                        : (<p>No products found</p>)
                }
            </div>

            <EditCategoryModal category={category} />
        </div>
    );
}
