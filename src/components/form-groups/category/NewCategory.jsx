"use client";
import { createCategory } from "@/lib/server-actions/categoryActions";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useFormState, useFormStatus } from 'react-dom';
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

export default function NewCategory() {

    // use form state and server action
    const pathname = usePathname();
    const [state, formAction] = useFormState(createCategory, { message: null, targetUrl: pathname });
    const { pending } = useFormStatus();
    // for revalidation and redirection in success scenario 
    const { mutate } = useSWRConfig();
    const router = useRouter();
    // fetch categories with no children for user to choose as parent category
    const { data, error } = useSWR('/api/category/get-category/get-no-children', fetcher);

    return (
        <form className='form' action={(formatDate) => {
            formAction(formatDate, pathname);
            mutate((key) => typeof key === 'string' && key.startsWith('/api/category/get-category'));
        }}>

            <div className='normalInput'>
                <RequiredInput required labelFor={"categoryName"}>Category Name</RequiredInput>
                <input name="categoryName" id="categoryName" type="text" required placeholder="Enter the category name" className='textField' />
            </div>

            <div className='normalInput'>
                <RequiredInput required labelFor={"categoryDescription"}>Category Description</RequiredInput>
                <AutoResizeTextArea name={"categoryDescription"} required={true} placeholder={"Enter a short description of the category"} />
            </div>

            <div className='sameLineInput'>
                <RequiredInput required labelFor={"labelColor"}>Label Color</RequiredInput>
                <input name="labelColor" id="labelColor" type="color" required className='colorPicker' />
            </div>

            <div className='normalInput'>
                <label htmlFor="parentCategoryId">Parent Category</label>
                <select name="parentCategoryId" id="parentCategoryId" className='dropdownSelect'>
                    <option key="null-option" value="">No parent</option>
                    {!error && !data?.error &&
                        data?.categories.filter(category => category.categoryName !== 'Others')
                            .map(category => (
                                <option key={category.id} value={category.id}>{category.categoryName}</option>
                            ))}
                </select>
            </div>

            {state?.message && <div className="formError">{state.message}</div>}

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