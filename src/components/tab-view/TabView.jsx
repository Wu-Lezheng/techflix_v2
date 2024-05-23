"use client";
import React, { useState } from "react";
import styles from "./TabView.module.css";

export default function TabView({ titles, children }) {

    const numberOfChildren = React.Children.count(children);
    if (!Array.isArray(titles) || numberOfChildren !== titles.length) {
        return null;
    }

    const [currentIndex, setCurrentIndex] = useState(0);

    return (
        <>
            <div className={styles.tabs}>
                {titles.map((title, index) => (
                    <div key={index} className={`${styles.tab} ${currentIndex === index && styles.activeTab}`} onClick={() => setCurrentIndex(index)}>{title}</div>
                ))}
            </div>
            <div className={styles.contents}>
                {React.Children.map(children, (child, index) => (
                    <div key={index} className={styles.content} style={{ translate: `${-100 * currentIndex}%` }}>
                        {child}
                    </div>
                ))}
            </div>
        </>
    );
}