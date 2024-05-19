"use client";
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import styles from "./CompanyHighlight.module.css"

function CompanyHighlight() {
    const [glowStates, setGlowStates] = useState([
        { x: "0px", y: "0px" },
        { x: "0px", y: "0px" },
        { x: "0px", y: "0px" }
    ]);

    // Refs for the glow containers
    const glowContainerRefs = [useRef(null), useRef(null), useRef(null)];

    const handleMouseMove = (event) => {
        const newStates = glowContainerRefs.map(ref => {
            const rect = ref.current.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            return { x: `${x}px`, y: `${y}px` };
        });

        setGlowStates(newStates);
    };

    return (
        <div className={styles.featureSection} onMouseMove={handleMouseMove}>
            <div ref={glowContainerRefs[0]} className={styles.glowContainer}
                style={{ '--light-x': glowStates[0].x, '--light-y': glowStates[0].y }}>
                <div className={styles.containerBorder}></div>
                <div className={styles.featureContent}>
                    <Image src="/innovative.png" alt='Innovative' width={140} height={140}></Image>
                    <h3>Innovative</h3>
                    <p>ST Engineering is innovative in nature</p>
                </div>
            </div>
            <div ref={glowContainerRefs[1]} className={styles.glowContainer}
                style={{ '--light-x': glowStates[1].x, '--light-y': glowStates[1].y }}>
                <div className={styles.containerBorder}></div>
                <div className={styles.featureContent}>
                    <p>Global</p>
                </div>
            </div>
            <div ref={glowContainerRefs[2]} className={styles.glowContainer}
                style={{ '--light-x': glowStates[2].x, '--light-y': glowStates[2].y }}>
                <div className={styles.containerBorder}></div>
                <div className={styles.featureContent}>
                    <p>Reliable</p>
                </div>
            </div>
        </div>
    );
}

export default CompanyHighlight;