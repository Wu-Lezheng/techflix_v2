"use client";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import Notification from "../notification/Notification";
import styles from "./UserInfo.module.css";

export default function UserInfo({ user }) {

    if (!user) {
        return (
            <div>
                <button>
                    <Link href="/login">Sign In</Link>
                </button>
            </div>
        );
    }

    function handleClick() {
        signOut();
    }

    return (
        <div className={styles.infoContainer}>
            <Notification user={user}></Notification>
            <div className={styles.userText}>
                <p className={styles.username}>{user.username}</p>
                {
                    user.isAdmin
                        ? (<p className={styles.userRole}>Admin</p>)
                        : (<p className={styles.userRole}>User</p>)
                }
            </div>
            <Image
                src={user.profilePic} alt={user.username}
                height={1920} width={1920}
                quality={100} className={styles.profilePic} priority
                onClick={handleClick}></Image>
        </div>
    );
}