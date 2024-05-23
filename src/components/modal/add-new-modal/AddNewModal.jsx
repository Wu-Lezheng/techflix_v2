"use client";
import TabView from "@/components/tab-view/TabView";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Modal from "../Modal";
import styles from "./AddNewModal.module.css";

export default function AddNewModal() {
    const pathname = usePathname();
    const router = useRouter();
    const [error, setError] = useState("hello");

    const handleCreateClick = () => {
        if (!error) {
            router.push(pathname);
        } else {
            // Handle other logic when there is error
            console.log("Create button clicked without navigation");
        }
    };

    return (
        <Modal name={"add-new"}>
            <div className={styles.modalContainer}>
                <TabView titles={["New Category", "New Product"]}>
                    <div>
                        Hello
                    </div>
                    <div>
                        <Link href={pathname}>
                            <button>Cancel</button>
                        </Link>
                        <button onClick={handleCreateClick}>Create</button>
                    </div>
                </TabView>
            </div>
        </Modal>
    );
}