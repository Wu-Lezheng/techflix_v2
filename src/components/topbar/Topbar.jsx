import styles from "./Topbar.module.css";
import SearchBar from "./search-bar/SearchBar";
import UserInfo from "./user-info/UserInfo";

export default function Topbar() {

    return (
        <div className={styles.topbarContainer}>
            <SearchBar></SearchBar>
            <UserInfo></UserInfo>
        </div>
    );
}