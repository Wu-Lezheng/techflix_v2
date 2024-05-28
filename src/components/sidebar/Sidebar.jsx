"use client";
import { useMediaQuery } from "@/lib/helper/mediaQuery";
import { motion } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AiFillHeart, AiFillHome, AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { BsArchiveFill } from "react-icons/bs";
import useSWR from "swr";
import styles from "./Sidebar.module.css";
import AddNew from "./add-new/AddNew";
import NavLink from "./nav-link/NavLink";

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function Sidebar() {

    const { data, error } = useSWR('/api/category/get-category/get-all', fetcher, { refreshInterval: 1000 });
    let isSmallScreen = useMediaQuery("(max-width: 1024px)");
    const [isOpen, setIsOpen] = useState(!isSmallScreen);
    const pathname = usePathname();

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

    if (error || data?.error) {
        // TODO: improve error message styles
        return <div>Error fetching categories</div>;
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
                    {data?.categories.filter(category => !category.parentCategoryId).map(category => (
                        <NavLink
                            key={category.id} currentCategory={category} allCategories={data.categories} icon={category.categoryName === 'Others' && <BsArchiveFill />}
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