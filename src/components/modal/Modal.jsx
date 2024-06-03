"use client";
import { useEffect } from "react";
import styles from "./Modal.module.css";

export default function Modal({ children }) {

    useEffect(() => {
        document.body.style.overflow = "hidden";

        // Cleanup function to restore scrolling when component unmounts
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    return (
        <dialog className={styles.modal}>
            <div className={styles.modalContainer}>{children}</div>
        </dialog>
    );
}