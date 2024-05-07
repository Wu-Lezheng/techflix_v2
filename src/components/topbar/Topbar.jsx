import { getUserId } from "@/lib/helper/userHelper";
import prisma from "@/lib/prisma";
import styles from "./Topbar.module.css";
import SearchBar from "./search-bar/SearchBar";
import UserInfo from "./user-info/UserInfo";

async function getUser() {
    const userId = await getUserId();
    if (!userId || userId.trim().length === 0) {
        return null;
    }
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });
    return user;
}

export default async function Topbar() {

    const user = await getUser();

    return (
        <div className={styles.topbarContainer}>
            <SearchBar></SearchBar>
            <UserInfo user={user}></UserInfo>
        </div>
    );
}