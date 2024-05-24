"use client";
import { useMediaQuery } from "@/lib/helper/mediaQuery";
import { motion } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AiFillHeart, AiFillHome, AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { BsArchiveFill } from "react-icons/bs";
import styles from "./Sidebar.module.css";
import AddNew from "./add-new/AddNew";
import NavLink from "./nav-link/NavLink";

export default function Sidebar() {

    const [categories, setCategories] = useState([]);
    let isSmallScreen = useMediaQuery("(max-width: 1024px)");
    const [isOpen, setIsOpen] = useState(!isSmallScreen);
    const pathname = usePathname();

    const getCategories = async () => {
        try {
            const response = await fetch(
                '/api/category/get-category',
                {
                    method: "GET",
                    next: { tags: ['categories'] }
                }
            );

            if (response) {
                const { data } = await response.json();
                if (data) setCategories(data);
            }

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    useEffect(() => {
        if (isSmallScreen) {
            setIsOpen(false);
        } else {
            setIsOpen(true);
        }
    }, [isSmallScreen]);

    useEffect(() => {
        if (isSmallScreen) {
            setIsOpen(false);
        }
    }, [pathname]);

    useEffect(() => {
        if (isOpen) {
            document.documentElement.style.setProperty('--sidebar-width', 'var(--o-sidebar-width)');
        } else {
            document.documentElement.style.setProperty('--sidebar-width', 0);
        }
    }, [isOpen]);

    const sidebarAnimation = {
        open: {
            x: 0,
            transition: {
                damping: 40,
            },
        },
        closed: {
            x: 'calc(var(--o-sidebar-width) * -1)',
            transition: {
                damping: 40,
            },
        },
    }

    return (
        <>
            {
                // the overlay when sidebar is open for smaller screens
                isSmallScreen && isOpen && (
                    <div onClick={() => setIsOpen(false)} className={styles.overlay}></div>
                )
            }

            <motion.div
                variants={sidebarAnimation}
                initial={{ x: isSmallScreen ? 'calc(var(--o-sidebar-width) * -1)' : 0 }}
                animate={isOpen ? 'open' : 'closed'}
                className={styles.sidebar}
            >
                <div className={styles.header}>
                    <div className={styles.logoSection}>
                        <Image src='/logo.png' alt="Logo" width={1920} height={1080} priority className={styles.logo}></Image>
                        <h2>TECHFLIX</h2>
                    </div>
                    <div className={styles.collapseButton} onClick={() => setIsOpen(false)}>
                        <AiOutlineClose />
                    </div>
                </div>

                <div className={styles.links}>
                    <NavLink icon={<AiFillHome />} path={'/home'} name={'Home'} needCheck={false} />
                    <NavLink icon={<AiFillHeart />} path={'/favourites'} name={'Favourites'} needCheck={false} />
                    {categories.filter(category => !category.parentCategoryId).map(category => (
                        <NavLink
                            key={category.id} currentCategory={category} allCategories={categories} icon={category.categoryName === 'Others' && <BsArchiveFill />}
                            path={`/category/${category.id}`} name={category.categoryName} needCheck={true}
                        />
                    ))}
                </div>

                <AddNew></AddNew>
            </motion.div>

            {!isOpen && (
                <div className={styles.menuButton} onClick={() => setIsOpen(true)}>
                    <AiOutlineMenu size="1.75rem" />
                </div>
            )}
        </>
    );
}