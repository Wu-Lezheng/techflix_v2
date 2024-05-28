"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import styles from "./Modal.module.css";

export default function Modal({ children, name }) {

    const searchParams = useSearchParams();
    const modalName = searchParams.get(name);

    useEffect(() => {
        if (modalName) {
            // Disable page scrolling
            document.body.style.overflow = "hidden";
        } else {
            // Enable page scrolling
            document.body.style.overflow = "";
        }

        // Cleanup function to restore scrolling when component unmounts
        return () => {
            document.body.style.overflow = "";
        };
    }, [modalName]);

    return (
        <>
            {modalName &&
                <dialog className={styles.modal}>{children}</dialog>
            }
        </>
    );
}