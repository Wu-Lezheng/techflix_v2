import { BsPlusLg } from "react-icons/bs";
import styles from "./AddNew.module.css";

export default function AddNew() {
    return (
        <div className={styles.container}>
            <div className={styles.addButton}>
                <BsPlusLg size='1.875rem' />
            </div>
            <h2 style={{ fontSize: '1.25rem' }}>Add New</h2>
        </div>
    );
}