"use client";
import Image from 'next/image';
import { useRef, useState } from 'react';
import styles from "./CompanyHighlight.module.css";

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
                    <Image src="/bulb-dynamic-gradient.svg" alt='Innovative' width={150} height={150} style={{ marginBottom: '0.5rem' }}></Image>
                    <h2>Innovative</h2>
                    <p> ST Engineering drives technological advancement through pioneering solutions in aerospace, electronics, land systems, and marine sectors</p>
                </div>
            </div>
            <div ref={glowContainerRefs[1]} className={styles.glowContainer}
                style={{ '--light-x': glowStates[1].x, '--light-y': glowStates[1].y }}>
                <div className={styles.containerBorder}></div>
                <div className={styles.featureContent}>
                    <Image src="/sphere-dynamic-gradient.svg" alt='Innovative' width={150} height={150} style={{ marginBottom: '0.5rem' }}></Image>
                    <h2>Global</h2>
                    <p>With a presence in over 100 countries, ST Engineering provides diverse, high-tech services and cutting-edge products on a global scale</p>
                </div>
            </div>
            <div ref={glowContainerRefs[2]} className={styles.glowContainer}
                style={{ '--light-x': glowStates[2].x, '--light-y': glowStates[2].y }}>
                <div className={styles.containerBorder}></div>
                <div className={styles.featureContent}>
                    <Image src="/sheild-dynamic-gradient.svg" alt='Innovative' width={150} height={150} style={{ marginBottom: '0.5rem' }}></Image>
                    <h2>Reliable</h2>
                    <p>Known for its commitment to quality and safety, ST Engineering delivers dependable engineering solutions across critical industries worldwide</p>
                </div>
            </div>
        </div>
    );
}

export default CompanyHighlight;