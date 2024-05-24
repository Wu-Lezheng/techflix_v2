"use client";

import { createCategory } from "@/lib/helper/categoryActions";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import RequiredInput from "../RequiredInput";

export default function NewCategory() {

    const [state, formAction] = useFormState(createCategory, '');
    const { pending } = useFormStatus();
    const formRef = useRef();
    const pathname = usePathname();
    const router = useRouter();

    return (
        <form ref={formRef} className='form' action={(formData) => {
            formAction(formData);
            if (!state.message) {
                // no error, reset and close the modal page
                formRef.current.reset();
                router.push(pathname);
            } else {
                console.log("Create button clicked without navigation");
            }
        }}>

            <label className='normalInput'>
                <RequiredInput required>Category Name</RequiredInput>
                <input name="categoryName" type="text" required className='textField' />
            </label>

            <label className='normalInput'>
                <RequiredInput required>Category Description</RequiredInput>
                <textarea name="categoryDescription" required className='textField'></textarea>
            </label>

            <label className='sameLineInput'>
                <RequiredInput required>Label Color</RequiredInput>
                <input name="labelColor" type="color" required className='colorPicker' />
            </label>

            <label className='sameLineInput'>
                <p>Parent Category</p>
                <select name="parentCategoryId" className='dropdownSelect'>
                    <option value="">Null</option>
                </select>
            </label>

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