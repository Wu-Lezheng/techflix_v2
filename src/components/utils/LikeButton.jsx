"use client";
import { addToFavourites, removeFromFavourites } from "@/lib/server-actions/favouritesActions";
import { useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import styles from "./LikeButton.module.css";

export default function LikeButton({ productId, className, size, liked }) {

    const [isLiked, setIsLiked] = useState(liked);

    async function handleClick(event) {
        event.preventDefault();
        let res;
        if (!isLiked) {
            res = await addToFavourites(productId);
        } else {
            res = await removeFromFavourites(productId);
        }

        if (res) {
            setIsLiked(res.result);
        }
    }

    return (
        <div className={`${className} ${isLiked ? styles.likeIconActive : styles.likeIcon}`} onClick={handleClick}>
            {
                isLiked
                    ? <AiFillHeart size={size} />
                    : <AiOutlineHeart size={size} />
            }
        </div>
    );
}