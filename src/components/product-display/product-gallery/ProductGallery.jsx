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
                <motion.div key={currentIndex} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} exit={{ opacity: 0.5 }} transition={{ duration: 0.5, ease: "easeInOut" }}>
                    <Image src={products[currentIndex].coverImage} alt={products[currentIndex].productName} fill sizes='99vw' quality={100} priority className={styles.productImage}></Image>
                </motion.div>
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
                    <motion.div
                        key={index}
                        className={styles.indicator}
                        initial={{ backgroundColor: 'var(--primary)' }}
                        animate={{ backgroundColor: index === currentIndex ? 'var(--accent)' : 'var(--primary)' }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                    ></motion.div>
                ))}
            </div>

        </div>
    );
}