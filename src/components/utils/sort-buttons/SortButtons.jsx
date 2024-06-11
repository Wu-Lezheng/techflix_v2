"use client";
import { useRouter } from "next/navigation";
import styles from "./SortButtons.module.css";

const SortButton = ({ buttonName, sortFunction }) => {
    return (
        <button className={styles.sortButton} onClick={sortFunction}>{buttonName}</button>
    );
};

function SortSection({ products }) {

    const router = useRouter();

    async function sortByViews() {
        products.sort((a, b) => b.numberOfViews - a.numberOfViews);
        router.refresh();
        console.log(products);
    }

    return (
        <div className={styles.sortSection}>
            <h2 style={{ fontSize: '1.25rem' }}>Sort by</h2>
            <div className={styles.buttonGroup}>
                <SortButton buttonName='Name'></SortButton>
                <SortButton buttonName='Upload Date'></SortButton>
                <SortButton buttonName='Views' sortFunction={sortByViews}></SortButton>
            </div>
        </div>
    );
}

export { SortButton, SortSection };

