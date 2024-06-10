"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./LandingTop.module.css";

export default function LandingTop() {

    const [isScrolled, setIsScrolled] = useState(false);
    const { data: session, status } = useSession()

    useEffect(() => {
        const handleScroll = () => {
            // Update isScrolled state based on scroll position
            setIsScrolled(window.scrollY > 20); // Change 50 to desired scroll threshold
        };

        // Attach the scroll event listener
        window.addEventListener('scroll', handleScroll);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className={`${styles.landingTop} ${isScrolled ? styles.scrolled : ''}`}>
            <div className={styles.logoSection}>
                <Image src="/logo.png" alt="Logo" width={48} height={48} style={{ height: '100%', width: 'auto' }}></Image>
                <h1 style={{ fontWeight: "var(--bold)" }}>TECHFLIX</h1>
            </div>
            <div className={styles.topButtonContainer}>
                <Link href="/contact" className={styles.contactUs}>Contact Us</Link>
                {
                    <Link href={status === "authenticated" ? "/home" : "/login"} style={{ height: '100%' }}>
                        <button className={styles.signInButton}>Sign In</button>
                    </Link>
                }
            </div>
        </div>
    );
}