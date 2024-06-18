"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { AiOutlineSearch } from "react-icons/ai";
import styles from "./SearchBar.module.css";


const SearchBar = () => {
    const [qeury, setQuery] = useState('');
    const searchParams = useSearchParams();
    const { replace } = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams);
        if (qeury && qeury.trim().length > 0) {
            params.set('query', qeury);
            replace(`/search-results?${params.toString()}`);
        } else {
            params.delete('query');
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.searchBar}>
            <label className={styles.searchContainer}>
                <input
                    type="text"
                    name="search"
                    placeholder="Press Enter to search"
                    value={qeury}
                    onChange={(e) => setQuery(e.target.value)}
                    className={`textField ${styles.searchInput}`}
                />
                <AiOutlineSearch size="1.5rem" className={styles.searchIcon} />
            </label>
        </form>
    );
};

export default SearchBar;