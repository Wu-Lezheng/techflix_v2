import ProductCardBg from "@/components/product-display/product-card-bg/ProductCardBg";
import Topbar from "@/components/topbar/Topbar";
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
    if (!userId || userId.length <= 0) {
        return (
            // TODO: improve handling of no user
            <div className="container">
                <Topbar></Topbar>
                <h1>My Favourites</h1>
                You must log in to view your favourite products
            </div>
        );
    }

    const favouriteProducts = await findFavouritesByUser(userId);

    return (
        <div className="container">
            <h1>My Favourites</h1>
            <div className={styles.likedProducts}>
                {Array.isArray(favouriteProducts) && favouriteProducts?.length > 0
                    ? favouriteProducts.map(product => (
                        <ProductCardBg key={product.id} product={product} />
                    ))
                    // TODO: edit 404
                    : <p>No products in favourites</p>
                }
            </div>
        </div>
    );
}