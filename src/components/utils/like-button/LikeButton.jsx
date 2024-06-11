"use client";
import { addToFavourites, removeFromFavourites } from "@/lib/server-actions/favouritesActions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import useSWR, { useSWRConfig } from 'swr';
import styles from "./LikeButton.module.css";

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function LikeButton({ productId, className, size }) {

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
            mutate((key) => typeof key === 'string' && key.startsWith('/api/product/get-liked'));
            router.refresh();
        }

        setPending(false);
    }

    return (
        <div className={`${className} ${data?.liked ? styles.likeIconActive : styles.likeIcon}`} onClick={pending ? null : handleClick} aria-disabled={pending}>
            {
                data?.liked
                    ? <AiFillHeart size={size} />
                    : <AiOutlineHeart size={size} />
            }
        </div>
    );
}