"use client";
import NewCategory from "@/components/form-groups/category/NewCategory";
import TabView from "@/components/tab-view/TabView";
import Modal from "../Modal";
import styles from "./AddNewModal.module.css";

export default function AddNewModal() {

    return (
        <Modal name={"add-new"}>
            <div className={styles.modalContainer}>
                <TabView titles={["New Category", "New Product"]}>
                    <NewCategory></NewCategory>
                    <div>
                        hello
                    </div>
                </TabView>
            </div>
        </Modal>
    );
}