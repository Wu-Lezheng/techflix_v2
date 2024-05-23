"use client";
import { useSearchParams } from "next/navigation";
import styles from "./Modal.module.css";

export default function Modal({ children, name }) {

    const searchParams = useSearchParams();
    const modalName = searchParams.get(name);

    return (
        <>
            {modalName &&
                <dialog className={styles.modal}>{children}</dialog>
            }
        </>
    );
}