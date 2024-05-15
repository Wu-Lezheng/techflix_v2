"use client";

import { FeatureLayout } from '@prisma/client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from './ProductFeature.module.css';

function ProductFeature({ feature }) {

    const styleName = feature.layout;

    const [containerClass, setContainerClass] = useState(styleName);

    useEffect(() => {
        const handleResize = () => {
            // Check window size and update containerClass accordingly
            if (window.innerWidth < 768) {
                setContainerClass(styleName.replace('SPLIT', 'STACK'));
            } else {
                setContainerClass(styleName);
            }
        };

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Remove event listener on component unmount
        return () => window.removeEventListener('resize', handleResize);
    }, [styleName]);

    let containerContent;

    if (containerClass === FeatureLayout.IMAGE_SPLIT || containerClass === FeatureLayout.IMAGE_STACK) {
        containerContent = (
            <>
                <div className={styles.imageContainer}>
                    <Image src={feature.featureImage} alt={feature.featureTitle} width="1920" height="1080" quality={100} className={styles.featureImage} priority></Image>
                </div>
                <div>
                    <h2 className={styles.featureTitle}>{feature.featureTitle}</h2>
                    <p className={styles.featureDescription}>{feature.featureDescription}</p>
                </div>
            </>
        );
    } else {
        containerContent = (
            <>
                <h2 className={styles.featureTitle}>{feature.featureTitle}</h2>
                <p className={styles.featureDescription}>{feature.featureDescription}</p>
            </>
        );
    }

    return (
        <div className={styles[containerClass]}>
            {containerContent}
        </div>
    );

}

export default ProductFeature;