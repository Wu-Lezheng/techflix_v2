"use client";
import ProductForm from "@/components/form-groups/product/ProductForm";
import TabView from "@/components/tab-view/TabView";
import { useSearchParams } from "next/navigation";
import Modal from "../Modal";

export default function EditProductModal({ product, mediaFiles }) {

    const searchParams = useSearchParams();
    const showModal = searchParams.get("edit-product");

    return showModal && (
        <Modal>
            <TabView titles={[" Edit Product"]}>
                <ProductForm product={product} mediaFiles={mediaFiles}></ProductForm>
            </TabView>
        </Modal>
    );

}