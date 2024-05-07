"use client";
import { useRef } from 'react';
import { AiOutlineSearch } from "react-icons/ai";
import styles from "./SearchBar.module.css";
const SearchBar = () => {
    const query = useRef("");

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <form onSubmit={handleSubmit} className={styles.searchBar}>
            <label className={styles.searchContainer}>
                <input
                    type="text"
                    name='search'
                    placeholder="Press Enter to search"
                    ref={query}
                    onChange={(e) => (query.current = e.target.value)}
                    className={styles.searchInput}
                />
                <AiOutlineSearch size="1.5rem" className={styles.searchIcon} />
            </label>
        </form>
    );
};

export default SearchBar;