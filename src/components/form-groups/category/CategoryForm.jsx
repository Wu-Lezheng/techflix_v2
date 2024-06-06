"use client";
import { createCategory, deleteCategory, updateCategory } from "@/lib/server-actions/categoryActions";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import useSWR, { useSWRConfig } from 'swr';
import AutoResizeTextArea from "../input-helper/AutoResizeTextArea";
import RequiredInput from "../input-helper/RequiredInput";

// besides server action, using api handler is also possible
// export async function createCategory(prevState, formData) {

//     const res = await fetch('/api/category/add-category', {
//         method: 'POST',
//         body: formData,
//     });

//     const data = await res.json();

//     if (data.targetUrl) {
//         redirect(data.targetUrl);
//     }

//     return data;
// }

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function CategoryForm({ category }) {

    const pathname = usePathname();
    const formRef = useRef(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [pending, setPending] = useState(false);
    // for revalidation and redirection in success scenario 
    const { mutate } = useSWRConfig();
    const router = useRouter();
    // fetch categories with no children for user to choose as parent category
    const { data, error } = useSWR('/api/category/get-category/get-all', fetcher);

    async function handleSubmit(event) {
        event.preventDefault();
        setPending(true);
        const data = new FormData(formRef.current);
        const { message, targetUrl } = category ? await updateCategory(category.id, data) : await createCategory(data);
        setErrorMessage(message);
        setPending(false);
        if (targetUrl) {
            await mutate((key) => typeof key === 'string' && key.startsWith('/api/category/get-category'));
            router.push(targetUrl);
        }
    }

    async function handleDelete(event) {
        event.preventDefault();
        setPending(true);
        const { message, targetUrl } = await deleteCategory(category);
        setErrorMessage(message);
        setPending(false);
        if (targetUrl) {
            await mutate((key) => typeof key === 'string' && key.startsWith('/api/category/get-category'));
            router.push('/home');
        }
    }

    return (
        <form ref={formRef} className='form' onSubmit={handleSubmit}>

            <div className='normalInput'>
                <RequiredInput required labelFor={"categoryName"}>Category Name</RequiredInput>
                <input name="categoryName" id="categoryName" type="text" required placeholder="Enter the category name" defaultValue={category?.categoryName} className='textField' />
            </div>

            <div className='normalInput'>
                <RequiredInput required labelFor={"categoryDescription"}>Category Description</RequiredInput>
                <AutoResizeTextArea name={"categoryDescription"} required={true} placeholder={"Enter a short description of the category"} defaultValue={category?.categoryDescription} />
            </div>

            <div className='sameLineInput'>
                <RequiredInput required labelFor={"labelColor"}>Label Color</RequiredInput>
                <input name="labelColor" id="labelColor" type="color" required defaultValue={category?.labelColor} className='colorPicker' />
            </div>

            <div className='normalInput'>
                <label htmlFor="parentCategoryId">Parent Category</label>
                <select name="parentCategoryId" id="parentCategoryId" defaultValue={category?.parentCategoryId || ''} className='dropdownSelect'>
                    <option key="null-option" value="">No parent</option>
                    {!error && !data?.error &&
                        data?.categories.filter(categoryOption => categoryOption.categoryName !== 'Others' && categoryOption.id !== category?.id)
                            .map(categoryOption => (
                                <option key={categoryOption.id} value={categoryOption.id}>{categoryOption.categoryName}</option>
                            ))}
                </select>
            </div>

            {errorMessage && <div className="formError">{errorMessage}</div>}

            <div>
                <Link href={pathname}>
                    <button>Cancel</button>
                </Link>
                {category ? <button onClick={handleDelete} aria-disabled={pending}>Delete</button> : <button type='reset'>Reset</button>}
                <button type='submit' aria-disabled={pending}>{category ? "Update" : "Create"}</button>
            </div>

        </form>
    );

}