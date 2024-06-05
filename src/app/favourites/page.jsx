import ProductCardBg from "@/components/product-display/product-card-bg/ProductCardBg";
import { fetchCategoriesForProducts } from "@/lib/helper/categoryHelper";
import { getUserId } from "@/lib/helper/userHelper";
import prisma from "@/lib/prisma";
import styles from "./page.module.css";

async function findFavouritesByUser(userId) {
    const favourites = await prisma.userFavourites.findMany({
        where: { userId },
        select: { productId: true },
    });
    const productIds = favourites.map(fav => fav.productId);
    const favouriteProducts = await prisma.product.findMany({
        where: {
            id: { in: productIds }
        }
    });

    return favouriteProducts;
}

export default async function Favourites() {

    const userId = await getUserId();
    if (userId?.length <= 0) {
        return (
            // TODO: improve handling of no user
            <div className="container">
                You must log in to view your favourite products
            </div>
        );
    }

    const favourites = await findFavouritesByUser(userId);
    const favouritesWithCategories = favourites?.length > 0
        ? fetchCategoriesForProducts(favourites)
        : [];

    return (
        <div className="container">
            <h1>My Favourites</h1>
            <div className={styles.likedProducts}>
                {favouritesWithCategories?.length > 0
                    ? favouritesWithCategories.map(({ product, category }) => (
                        <ProductCardBg key={product.id} product={product} category={category} />
                    ))
                    // TODO: edit 404
                    : <p>No recently viewed</p>
                }
            </div>
        </div>
    );
}