"use client";
import { addToFavourites, removeFromFavourites } from "@/lib/server-actions/favouritesActions";
import { useRouter } from "next/navigation";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import styles from "./LikeButton.module.css";

export default function LikeButton({ productId, className, size, liked }) {

    const router = useRouter();

    async function handleClick(event) {
        event.preventDefault();
        let res;
        if (!liked) {
            res = await addToFavourites(productId);
        } else {
            res = await removeFromFavourites(productId);
        }

        if (res) {
            liked = res.result
            router.refresh();
        }
    }

    return (
        <div className={`${className} ${liked ? styles.likeIconActive : styles.likeIcon}`} onClick={handleClick}>
            {
                liked
                    ? <AiFillHeart size={size} />
                    : <AiOutlineHeart size={size} />
            }
        </div>
    );
}