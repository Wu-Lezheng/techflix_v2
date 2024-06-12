"use client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import Notification from "../notification/Notification";
import styles from "./UserInfo.module.css";

export default function UserInfo() {

    const { data: session, status } = useSession();

    if (status !== "authenticated") {
        return (
            <button style={{ fontSize: '0.875rem', height: '45%' }}>
                <Link href="/login">Sign In</Link>
            </button>
        );
    }

    const user = session.user;

    async function handleClick() {
        signOut();
    }

    return (
        <div className={styles.infoContainer}>
            <Notification user={user}></Notification>
            <div className={styles.userText}>
                <p className={styles.username}>{user.name}</p>
                {
                    user.isAdmin
                        ? (<p className={styles.userRole}>Admin</p>)
                        : (<p className={styles.userRole}>User</p>)
                }
            </div>
            <Image
                src={user.image} alt={user.name}
                height={1920} width={1920}
                quality={100} className={styles.profilePic} priority
                onClick={handleClick}>
            </Image>
        </div>
    );
}