"use client";
import MultipleUploads from "../input-helper/MultipleUploads";

export default function MediaUploadForNew({ formRef, files, setProductData }) {
    return (
        <form ref={formRef} className="form">
            <MultipleUploads required={false} title={"Product Media"} name={"mediaFiles"} files={files} setProductData={setProductData} />
        </form>
    );
}