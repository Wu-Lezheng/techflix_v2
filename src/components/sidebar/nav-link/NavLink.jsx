"use client";
import { AnimatePresence, motion } from 'framer-motion';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from 'react';
import { AiFillFolder, AiOutlineRight } from "react-icons/ai";
import { BsBookmarkFill } from "react-icons/bs";
import styles from "./NavLink.module.css";

export default function NavLink({ currentCategory, allCategories, icon, path, name, needCheck }) {

    let childCategories = [];
    let hasChildren = false;
    const pathname = usePathname();

    if (needCheck) {
        childCategories = allCategories.filter(category => category.parentCategoryId === currentCategory.id);
        hasChildren = childCategories.length > 0;
    }

    // dropdown and pullup
    const [isOpen, setIsOpen] = useState(false);
    const [isRotated, setIsRotated] = useState(false);
    const variants = {
        open: { opacity: 1, height: 'auto' },
        closed: { opacity: 0, height: 0 }
    };
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        setIsRotated(!isRotated);
    };

    // tooltip
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    const handleMouseOver = (e) => {
        setTooltipVisible(true);
        positionTooltip(e);
    };

    const handleMouseMove = (e) => {
        positionTooltip(e);
    };

    const handleMouseOut = () => {
        setTooltipVisible(false);
    };

    const positionTooltip = (e) => {
        const { clientX, clientY } = e;
        setTooltipPosition({ x: clientX, y: clientY });
    };

    // content of each nav link
    const displayIcon = icon || (hasChildren ? <AiFillFolder /> : <BsBookmarkFill color={currentCategory.labelColor} />);
    const content = (
        <div className={`${styles.content} ${pathname === path && styles.currentLink}`}
            onMouseOver={handleMouseOver} onMouseMove={handleMouseMove} onMouseOut={handleMouseOut}
        >
            {displayIcon}
            <p className={styles.linkText}>{name}</p>
            <AiOutlineRight style={{ transform: isRotated ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
            {tooltipVisible && (
                <motion.div className={styles.tooltip} style={{ left: `${tooltipPosition.x + 10}px`, top: `${tooltipPosition.y + 10}px` }}
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, delay: 1.5 }}
                >
                    {name}
                </motion.div>
            )}
        </div>
    );

    return (
        <>
            {hasChildren
                ? (<div className={styles.parent}>
                    <div onClick={toggleDropdown}>
                        {content}
                    </div>
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                className={styles.children}
                                initial="closed" animate="open" exit="closed"
                                variants={variants} transition={{ duration: 0.3 }}
                            >
                                {childCategories.map(child => (
                                    <NavLink
                                        key={child.id}
                                        currentCategory={child}
                                        allCategories={allCategories}
                                        path={`/category/${child.id}`}
                                        name={child.categoryName}
                                        needCheck={true}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>)
                : (<Link href={path} className={styles.link}>
                    {content}
                </Link>)}
        </>
    );

}