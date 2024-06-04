"use client";
import CategoryForm from "@/components/form-groups/category/CategoryForm";
import TabView from "@/components/tab-view/TabView";
import { useSearchParams } from "next/navigation";
import Modal from "../Modal";

export default function EditCategoryModal({ category }) {

    const searchParams = useSearchParams();
    const showModal = searchParams.get("edit-category");

    return showModal && (
        <Modal>
            <TabView titles={[" Edit Category"]}>
                <CategoryForm category={category}></CategoryForm>
            </TabView>
        </Modal>
    );
}