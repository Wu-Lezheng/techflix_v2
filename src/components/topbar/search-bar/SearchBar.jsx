"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import { useRef } from 'react';
import { AiOutlineSearch } from "react-icons/ai";
import styles from "./SearchBar.module.css";


const SearchBar = () => {
    const query = useRef('');
    const searchParams = useSearchParams();
    const { replace } = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();
        const term = query.current;
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        replace(`/search-results?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.searchBar}>
            <label className={styles.searchContainer}>
                <input
                    type="text"
                    name="search"
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