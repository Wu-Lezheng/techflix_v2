"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./Sidebar.module.css";

export default function Sidebar() {

    const [categories, setCategories] = useState([]);
    const [isOpen, setIsOpen] = useState(true);

    const getCategories = async () => {
        try {
            const response = await fetch(
                '/api/category/get-category',
                {
                    method: "GET",
                    next: {
                        // TODO: remember to revalidate data with database operations
                        tags: ['categories']
                    }
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

    return (
        <div className={styles.container}>
            {categories.map((category, index) => (
                <div key={index}>
                    <Link href={`/category/${category.id}`}>{category.categoryName}</Link>
                </div>
            ))}
        </div>
    );
}