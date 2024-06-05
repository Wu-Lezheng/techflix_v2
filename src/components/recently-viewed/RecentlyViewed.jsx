"use server";
import { fetchCategoriesForProducts } from "@/lib/helper/categoryHelper";
import ProductCardBg from "../product-display/product-card-bg/ProductCardBg";
import styles from "./RecentlyViewed.module.css";

export default async function RecentlyViewed({ products, count }) {

    if (products && count < products.length) {
        products = products.slice(0, count);
    }

    let productsWithCategories = [];
    if (products?.length > 0) {
        productsWithCategories = await fetchCategoriesForProducts(products);
    }

    return (
        <div>
            <h1 className={styles.sectionTitle}>Recently Viewed</h1>
            <div className={styles.recentProducts}>
                {Array.isArray(products) && products?.length > 0
                    ? productsWithCategories.map(({ product, category }) => (
                        <ProductCardBg key={product.id} product={product} category={category} />
                    ))
                    // TODO: edit 404
                    : <p>No recently viewed</p>
                }
            </div>
        </div>
    );
}