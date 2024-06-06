"use client";
import { formatDate } from "@/lib/helper/formatter";
import { MediaType } from "@prisma/client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AiFillPlayCircle, AiOutlineDoubleLeft, AiOutlineDoubleRight } from "react-icons/ai";
import styles from "./MediaSlider.module.css";


export default function MediaSlider({ product, category, mediaFiles }) {

    // insert the cover page to the array
    const files = [{ fileName: 'coverImage', filePath: product.coverImage, mediaType: MediaType.IMAGE }, ...mediaFiles];

    // for navigation and animaiton
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToIndex = (index) => {
        setCurrentIndex(index);
    };

    const [scrollPosition, setScrollPosition] = useState(0);
    const outer = useRef(null);
    const inner = useRef(null);

    const scrollLeft = () => {
        // Calculate the maximum scroll position to the left
        const maxScrollLeft = 0;

        // Calculate the new scroll position as a percentage of the container width
        const containerWidth = outer.current.offsetWidth;
        const scrollPercentage = 0.3;
        const scrollDistance = containerWidth * scrollPercentage;
        const newScrollPosition = Math.max(scrollPosition - scrollDistance, maxScrollLeft);

        // Set the new scroll position
        setScrollPosition(newScrollPosition);
    };

    const scrollRight = () => {
        // Calculate the maximum scroll position to the right
        const maxScrollRight = inner.current.offsetWidth - outer.current.offsetWidth;

        // Calculate the new scroll position as a percentage of the container width
        const containerWidth = outer.current.offsetWidth;
        const scrollPercentage = 0.3;
        const scrollDistance = containerWidth * scrollPercentage;
        const newScrollPosition = Math.min(scrollPosition + scrollDistance, maxScrollRight);

        // Set the new scroll position
        setScrollPosition(newScrollPosition);
    };

    useEffect(() => {
        const handleResize = () => {
            // Recalculate and clamp the scroll position on window resize
            setScrollPosition(0);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [scrollPosition]);


    // for the first media file, which will always be the cover page

    return (
        <div className={styles.mediaSlider}>

            {/* for media display */}
            <div className={styles.mediaDisplay}>
                {files.map((file, index) => (
                    index === 0 ? (
                        // cover image
                        <div key={index} className={styles.mediaContainer} style={{ translate: `${-100 * currentIndex}%` }}>
                            <Image src={product.coverImage} alt={product.productName} width={1920} height={1080} priority quality={100} style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}></Image>
                            <div className={styles.textOverlay}>
                                <p className={styles.productName}>{product.productName}</p>
                                <p className={styles.productData} style={{ color: category.labelColor }}>{`${formatDate(product.createdAt)} | ${category.categoryName}`}</p>
                                <p className={styles.productSummary}>{product.productSummary}</p>
                            </div>
                        </div>
                    ) : (
                        <div key={index} className={styles.mediaContainer} style={{ translate: `${-100 * currentIndex}%` }}>
                            {
                                file.mediaType === MediaType.IMAGE
                                    ? <Image src={file.filePath} alt={file.fileName} fill sizes="99vw" priority quality={100} style={{ objectFit: 'cover' }}></Image>
                                    : <video src={file.filePath} controls width={"100%"} height={"100%"} style={{ objectFit: 'cover' }}>
                                        Your browser does not support the video tag.
                                    </video>
                            }
                        </div>
                    )
                ))}
                {/* for box shadow overlay */}
                <div className={styles.borderShadow}></div>
            </div>

            {/* for media previews and slider navigation */}
            <div ref={outer} className={styles.mediaPreviews}>
                <button className={styles.mediaSliderNav} style={{ left: '0', background: 'linear-gradient(to right, var(--bg), rgb(36, 37, 41, 0.1))' }} onClick={scrollLeft}>
                    <AiOutlineDoubleLeft size="1.25rem" />
                </button>
                <button className={styles.mediaSliderNav} style={{ right: '0', background: 'linear-gradient(to left, var(--bg), rgb(36, 37, 41, 0.1))' }} onClick={scrollRight}>
                    <AiOutlineDoubleRight size="1.25rem" />
                </button>
                <div ref={inner} className={styles.allPreviews} style={{ translate: `-${scrollPosition}px` }}>
                    {files?.map((file, index) => (
                        <div key={index} className={styles.previewContainer} onClick={() => goToIndex(index)}>
                            {
                                file.mediaType === MediaType.IMAGE
                                    ? <Image
                                        src={file.filePath} alt={file.fileName}
                                        height={1980} width={1020} priority
                                        className={`${styles.preview} ${index === currentIndex && styles.activePreview}`}>
                                    </Image>
                                    : <>
                                        <video src={file.filePath} className={`${styles.preview} ${index === currentIndex && styles.activePreview}`}>
                                            Your browser does not support the video tag.
                                        </video>
                                        <AiFillPlayCircle color="var(--primary)" size={"3rem"} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                                    </>
                            }

                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}