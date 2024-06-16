"use client";
import useSWR from "swr";
import AutoResizeTextArea from "../input-helper/AutoResizeTextArea";
import RequiredInput from "../input-helper/RequiredInput";
import SingleUpload from "../input-helper/SingleUpload";

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function ProductEssentials({ formRef, productData, handleChange, setProductData }) {

    // fetch categories with no children for user to choose as parent category
    const { data, error } = useSWR('/api/category/get-category/get-no-children', fetcher);

    return (
        <form ref={formRef} className='form'>

            <div className='normalInput'>
                <RequiredInput required labelFor={"productName"}>Product Name</RequiredInput>
                <input name="productName" id="productName" type="text" required placeholder="Enter the product name" className='textField'
                    value={productData.productName} onChange={handleChange}
                />
            </div>

            <div className='normalInput'>
                <RequiredInput required labelFor={"productSummary"}>Product Summary</RequiredInput>
                <AutoResizeTextArea name={"productSummary"} required={true} placeholder={"Enter a short summary of the product"}
                    value={productData.productSummary} handleChange={handleChange}
                />
            </div>

            <div className='normalInput'>
                <RequiredInput required labelFor={"categoryId"}>Product Category</RequiredInput>
                <select name="categoryId" id="categoryId" required className='dropdownSelect' value={productData.categoryId} onChange={handleChange}>
                    <option value="" disabled>Please select a category</option>
                    {!error && !data?.error && data?.categories.map(category => (
                        <option key={category.id} value={category.id}>{category.categoryName}</option>
                    ))}
                </select>
            </div>

            <SingleUpload required={true} title={"Cover Image"} name={"coverImage"} file={productData.coverImage} setProductData={setProductData} />

        </form>
    );
}