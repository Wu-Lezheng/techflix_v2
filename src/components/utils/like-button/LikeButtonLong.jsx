"use client";
import { addToFavourites, removeFromFavourites } from "@/lib/server-actions/favouritesActions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useSWR, { useSWRConfig } from 'swr';
import styles from "./LikeButtonLong.module.css";

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function LikeButtonLong({ productId }) {

    const router = useRouter();
    const { data, error } = useSWR(`/api/product/get-liked/${productId}`, fetcher);
    const { mutate } = useSWRConfig();
    const [pending, setPending] = useState(false);

    async function handleClick(event) {
        event.preventDefault();
        setPending(true);
        let res;
        if (data?.liked === false) {
            res = await addToFavourites(productId);
        } else if (data?.liked === true) {
            res = await removeFromFavourites(productId);
        } else {
            // no data
        }

        if (res) {
            await mutate(`/api/product/get-liked/${productId}`);
            router.refresh();
        }

        setPending(false);
    }

    return (
        <button onClick={handleClick} aria-disabled={pending} className={`${styles.likeButton} ${data?.liked && styles.likeButtonActive}`} >
            {data?.liked ? "Remove from favourites" : "Add to favourites"}
        </button>
    );
}