"use client";
import { formatFileSize } from "@/lib/helper/formatter";
import Image from "next/image";
import { AiFillDelete, AiFillPlayCircle } from "react-icons/ai";
import styles from "./MediaPreview.module.css";

export default function MediaPreview({ file, fileUrl, handleClick, width = '75%' }) {
    return (
        <div className={styles.previewContainer} style={{ width: width }}>
            <div className={styles.previewInfo}>
                <div style={{ position: 'relative', height: '100%', aspectRatio: '16/9' }}>
                    {file.type.startsWith('image/')
                        ? <Image src={fileUrl} alt={file?.name} fill sizes="99vw" priority className={styles.previewMedia}></Image>
                        : <>
                            <video width={"100%"} height={"100%"} className={styles.previewMedia}>
                                <source src={fileUrl} type={file.type} />
                                Your browser does not support the video tag.
                            </video>
                            <AiFillPlayCircle color="var(--primary)" size={"2rem"} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                        </>
                    }

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