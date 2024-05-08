"use client";
import { formatDate } from "@/lib/helper/formatter";
import Image from "next/image";
import { useState } from "react";
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from "react-icons/ai";
import styles from "./MediaSlider.module.css";


export default function MediaSlider({ product, category, mediaFiles }) {

    const files = [{ fileName: 'coverImage', filePath: product.coverImage }, ...mediaFiles];

    const [currentIndex, setCurrentIndex] = useState(0);

    const goToIndex = (index) => {
        setCurrentIndex(index);
    };

    const [scrollPosition, setScrollPosition] = useState(0);

    const scrollLeft = () => {
        setScrollPosition(scrollPosition - 100);
    };

    const scrollRight = () => {
        setScrollPosition(scrollPosition + 100);
    };

    const cover = <div className={styles.mediaContainer}>
        <Image src={product.coverImage} alt={product.productName} fill sizes="99vw" priority quality={100} style={{ objectFit: 'cover' }}></Image>
        <div className={styles.textOverlay}>
            <p className={styles.productName}>{product.productName}</p>
            <p className={styles.productData} style={{ color: category.labelColor }}>{`${formatDate(product.createdAt)} | ${category.categoryName}`}</p>
            <p className={styles.productSummary}>{product.productSummary}</p>
        </div>
    </div>;

    return (
        <div className={styles.mediaSlider}>
            {cover}
            <div className={styles.mediaPreviews}>
                <button className={styles.mediaSliderNav} style={{ left: '0' }} onClick={scrollLeft}>
                    <AiOutlineDoubleLeft size="1.25rem" />
                </button>
                <button className={styles.mediaSliderNav} style={{ right: '0' }} onClick={scrollRight}>
                    <AiOutlineDoubleRight size="1.25rem" />
                </button>
                <div className={styles.allPreviews} style={{ transform: `translateX(-${scrollPosition}px)` }}>
                    {files.map((file, index) => (
                        <div key={index} className={styles.previewContainer}>
                            <Image src={file.filePath} alt={file.fileName} height={1980} width={1020} priority className={styles.preview}></Image>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}