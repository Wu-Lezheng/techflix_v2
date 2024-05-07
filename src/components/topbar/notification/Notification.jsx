import { AiOutlineBell } from "react-icons/ai";
import styles from "./Notification.module.css";

export default function Notification({ user }) {
    return (
        <div className={styles.iconContainer}>
            <AiOutlineBell size="1.25rem" />
        </div>
    );
}