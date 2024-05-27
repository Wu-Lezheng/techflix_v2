"use client";
import { createProduct } from "@/lib/server-actions/productActions";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFormState, useFormStatus } from 'react-dom';
import useSWR from "swr";
import RequiredInput from "../RequiredInput";

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function NewProduct() {

    const pathname = usePathname();
    const [state, formAction] = useFormState(createProduct, { message: null, targetUrl: pathname });
    const { pending } = useFormStatus();
    // fetch categories with no children for user to choose as parent category
    const { data, error } = useSWR('/api/category/get-category/get-no-children', fetcher);

    return (
        <form className='form'>

            <div className='normalInput'>
                <RequiredInput required labelFor={"productName"}>Produc tName</RequiredInput>
                <input name="productName" id="productName" type="text" required className='textField' />
            </div>

            <div className='normalInput'>
                <RequiredInput required labelFor={"productSummary"}>Product Summary</RequiredInput>
                <textarea name="productSummary" id="productSummary" required className='longTextField'></textarea>
            </div>

            <div className='normalInput'>
                <RequiredInput required labelFor={"categoryId"}>Product Category</RequiredInput>
                <select name="categoryId" id="categoryId" required className='dropdownSelect'>
                    {!error && !data?.error && data?.categories.map(category => (
                        <option key={category.id} value={category.id}>{category.categoryName}</option>
                    ))}
                </select>
            </div>

            <div>{state?.message}</div>

            <div>
                <Link href={pathname}>
                    <button>Cancel</button>
                </Link>
                <button type='reset'>Reset</button>
                <button type='submit' aria-disabled={pending}>Create</button>
            </div>

        </form>
    );
}