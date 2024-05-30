"use client";
import { formatFileSize } from "@/lib/helper/formatter";
import Image from "next/image";
import { AiFillDelete } from "react-icons/ai";
import styles from "./MediaPreview.module.css";

export default function MediaPreview({ file, fileUrl, handleClick }) {
    return (
        <div className={styles.previewContainer}>
            <div className={styles.previewInfo}>
                <div style={{ position: 'relative', height: '100%', aspectRatio: '16/9' }}>
                    <Image src={fileUrl} alt={file?.name} fill sizes="99vw" priority className={styles.previewImage}></Image>
                </div>
                <div className={styles.previewData}>
                    <p>{file?.name}</p>
                    <p style={{ fontWeight: 'var(--medium)' }}>{formatFileSize(file?.size)}</p>
                </div>
            </div>
            <AiFillDelete color="var(--accent)" size={"1.5rem"} style={{ cursor: 'pointer' }} onClick={handleClick} />
        </div>
    );
}