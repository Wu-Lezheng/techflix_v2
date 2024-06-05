"use client";
import { useEffect } from "react";
import styles from "./Modal.module.css";

export default function Modal({ children }) {

    // TODO: handle scrolling prevention better
    useEffect(() => {
        // Save the current scroll position
        const scrollPosition = window.scrollY;
        // Disable scrolling
        document.body.style.overflow = 'hidden';

        // Cleanup function to restore scrolling and scroll position when component unmounts
        return () => {
            document.body.style.overflow = '';
            window.scrollTo(0, scrollPosition);
        };
    }, []);

    return (
        <dialog className={styles.modal}>
            <div className={styles.modalContainer}>{children}</div>
        </dialog>
    );
}