"use client";
import { formatFileSize } from "@/lib/helper/formatter";
import Image from "next/image";
import { AiFillDelete, AiFillPlayCircle } from "react-icons/ai";
import styles from "./MediaPreview.module.css";

export default function MediaPreview({ file, fileUrl, handleClick, width = '75%' }) {
    return (
        <div className={styles.previewContainer} style={{ width: width }}>
            <div className={styles.previewInfo}>
                <div className={styles.mediaContainer}>
                    {file.type.startsWith('image/')
                        ? <Image src={fileUrl} alt={file?.name} width={1920} height={1080} priority quality={50} className={styles.previewMedia}></Image>
                        : <>
                            <video src={fileUrl} width={"100%"} height={"100%"} className={styles.previewMedia}>
                                Your browser does not support the video tag.
                            </video>
                            <AiFillPlayCircle color="var(--primary)" size={"2rem"} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                        </>
                    }

                </div>
                <div className={styles.previewData}>
                    <p style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{file?.name}</p>
                    <p style={{ fontWeight: 'var(--medium)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{formatFileSize(file?.size)}</p>
                </div>
            </div>
            <AiFillDelete color="var(--accent)" size={"1.5rem"} style={{ cursor: 'pointer' }} onClick={handleClick} />
        </div>
    );
}