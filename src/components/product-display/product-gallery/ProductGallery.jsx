"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

import { AiOutlineLeft } from "react-icons/ai";
import { AiOutlineRight } from "react-icons/ai";
import styles from "./ProductGallery.module.css";

export default function ProductGallery({ products, count }) {

    if (count > products.length) {
        console.error('Count should not be greater than the products array length.');
        return null;
    }

    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((currentIndex + 1) % count);
    };

    const handlePrev = () => {
        setCurrentIndex((currentIndex - 1 + count) % count);
    };

    return (
        <div className={styles.galleryContainer}>

            <div className={styles.imageContainer}>
                <Image src={products[currentIndex].coverImage} alt={products[currentIndex].productName} fill sizes='99vw' quality={100} priority className={styles.productImage}></Image>
                <div className={styles.navContainer}>
                    <button onClick={handlePrev} className={styles.navButton}>
                        <AiOutlineLeft />
                    </button>
                    <button onClick={handleNext} className={styles.navButton}>
                        <AiOutlineRight />
                    </button>
                </div>

            </div>

            <div className={styles.indicators}>
                {products.slice(0, count).map((_, index) => (
                    <div key={index} className={`${styles.indicator} ${index === currentIndex ? styles.activeIndicator : ''}`}></div>
                ))}
            </div>

        </div>
    );
}