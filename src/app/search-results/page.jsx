import CategoryDisplay from "@/components/category-display/CategoryDisplay";
import ProductCardBg from "@/components/product-display/product-card-bg/ProductCardBg";
import prisma from "@/lib/prisma";
import styles from "./page.module.css";

async function searchProductsPartial(text) {
    const products = await prisma.product.findMany({
        where: {
            productName: {
                contains: text, mode: 'insensitive'
            }
        }
    });

    return products;
}

async function searchCategoriesPartial(text) {
    const categories = await prisma.category.findMany({
        where: {
            categoryName: {
                contains: text, mode: 'insensitive'
            }
        }
    });

    return categories;
}

export default async function SearchResultsPage({ searchParams }) {
    const query = searchParams?.query || '';

    if (!query) {
        return (
            <div className="container">
                <p>There is no search performed</p>
            </div>
        );
    }

    const productsMatched = await searchProductsPartial(query);
    const categoriesMatched = await searchCategoriesPartial(query);

    return (
        <div className="container">

            <h1>Search results for "{query}"</h1>

            <div style={{ marginTop: '1.5rem' }}>
                <h2>Products that match</h2>
                <div className={styles.grid}>
                    {Array.isArray(productsMatched) && productsMatched.length > 0
                        ? productsMatched.map(product => (
                            <ProductCardBg key={product.id} product={product}></ProductCardBg>
                        ))
                        : <p>No products match your search</p>
                    }
                </div>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
                <h2>Categories that match</h2>
                <div className={styles.grid}>
                    {Array.isArray(categoriesMatched) && categoriesMatched.length > 0
                        ? categoriesMatched.map(category => (
                            <CategoryDisplay key={category.id} category={category}></CategoryDisplay>
                        ))
                        : <p>No categories match your search</p>
                    }
                </div>
            </div>

        </div>
    );
}