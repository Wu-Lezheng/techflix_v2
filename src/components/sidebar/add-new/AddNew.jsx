import { useSession } from "next-auth/react";
import Link from "next/link";
import { BsPlusLg } from "react-icons/bs";
import styles from "./AddNew.module.css";

export default function AddNew() {

    const { data: session, status } = useSession();
    if (session?.user.isAdmin === false) {
        return;
    }

    return (
        <div className={styles.container}>
            <Link href="?add-new=true" scroll={false}>
                <div className={styles.addButton}>
                    <BsPlusLg size='1.75rem' />
                </div>
            </Link>
            <h2 style={{ fontSize: '1.125rem' }}>Add New</h2>
        </div>
    );
}