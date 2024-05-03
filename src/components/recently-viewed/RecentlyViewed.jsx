import ProductCardBg from "@/components/product-display/product-card-bg/ProductCardBg";
import styles from "./RecentlyViewed.module.css";

export default function RecentlyViewed({ products, count }) {

    if (count < products.length) {
        products = products.slice(0, count);
    }

    return (
        <div>
            <h1 className={styles.sectionTitle}>Recently Viewed</h1>
            <div className={styles.recentProducts}>
                {Array.isArray(products) && products.length > 0
                    ? products.map(product => (
                        <ProductCardBg product={product} />
                    ))
                    // TODO: edit 404
                    : <p>No recently viewed</p>
                }
            </div>
        </div>
    );
}