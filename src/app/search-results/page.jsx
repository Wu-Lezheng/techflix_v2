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

async function searchProductsWithTag(text) {
    const products = await prisma.product.findMany({
        where: {
            tags: {
                some: { tag: { tagName: { equals: text, mode: 'insensitive' }, }, },
            },
        },
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
    const productsWithTag = await searchProductsWithTag(query);
    const categoriesMatched = await searchCategoriesPartial(query);

    return (
        <div className="container">

            <h1>Search results for "{query}"</h1>

            <div style={{ marginTop: '1.5rem' }}>
                <h2>Products that match</h2>
                {Array.isArray(productsMatched) && productsMatched.length > 0
                    ? <div className={styles.grid}>
                        {productsMatched.map(product => (
                            <ProductCardBg key={product.id} product={product}></ProductCardBg>
                        ))}
                    </div>
                    // TODO: handle the not-found better, also for the rest below
                    : <p style={{ marginTop: '1rem' }}>No products match your search</p>
                }

            </div>

            <div style={{ marginTop: '1.5rem' }}>
                <h2>Products with tag "{query}"</h2>
                {Array.isArray(productsWithTag) && productsWithTag.length > 0
                    ? <div className={styles.grid}>
                        {productsWithTag.map(product => (
                            <ProductCardBg key={product.id} product={product}></ProductCardBg>
                        ))}
                    </div>
                    : <p style={{ marginTop: '1rem' }}>No products have the tag or the tag doesn't exist</p>
                }
            </div>

            <div style={{ marginTop: '1.5rem' }}>
                <h2>Categories that match</h2>
                {Array.isArray(categoriesMatched) && categoriesMatched.length > 0
                    ? <div className={styles.grid}>
                        {categoriesMatched.map(category => (
                            <CategoryDisplay key={category.id} category={category}></CategoryDisplay>
                        ))}
                    </div>
                    : <p style={{ marginTop: '1rem' }}>No categories match your search</p>
                }
            </div>

        </div>
    );
}