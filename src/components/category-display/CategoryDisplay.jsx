import { BsBookmarkFill } from "react-icons/bs";
import styles from "./CategoryDisplay.module.css";

export default function CategoryDisplay({ category }) {
    return (
        <div className={styles.categoryCard}>
            <BsBookmarkFill style={{ display: 'block' }} color={category.labelColor} size={"1rem"} />
            <p className={styles.categoryName}>{category.categoryName}</p>
        </div>
    );
}