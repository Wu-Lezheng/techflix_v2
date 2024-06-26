"use client";
import CategoryForm from "@/components/form-groups/category/CategoryForm";
import ProductForm from "@/components/form-groups/product/ProductForm";
import TabView from "@/components/tab-view/TabView";
import { useSearchParams } from "next/navigation";
import Modal from "../Modal";

export default function AddNewModal() {

    const searchParams = useSearchParams();
    const showModal = searchParams.get("add-new");

    return showModal && (
        <Modal>
            <TabView titles={["New Category", "New Product"]}>
                <CategoryForm></CategoryForm>
                <ProductForm></ProductForm>
            </TabView>
        </Modal>
    );
}