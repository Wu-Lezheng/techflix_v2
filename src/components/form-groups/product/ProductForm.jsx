"use client";
import { createProduct, deleteProduct } from "@/lib/server-actions/productActions";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import MediaUploadForNew from "./MediaUploadForNew";
import ProductEssentialsForNew from "./ProductEssentialsForNew";

const fetcher = (...args) => fetch(...args).then(res => res);

export default function ProductForm({ product }) {

    const pathname = usePathname();
    const router = useRouter();
    // const { data, error } = useSWR(`/api/product/get-files/${product?.id}`, fetcher);

    // for form refs
    const formRefs = [useRef(null), useRef(null)];

    // for form data
    const defaultData = {
        productName: '', productSummary: '', categoryId: '', coverImage: '',
        mediaFiles: [],
        tags: [], keywords: [],
        specifications: [], features: []
    };
    const [productData, setProductData] = useState({
        productName: product?.productName || '',
        productSummary: product?.productSummary || '',
        categoryId: product?.categoryId || '',
        coverImage: '',
        mediaFiles: [],
        tags: [],
        keywords: [],
        specifications: [],
        features: []
    });
    const [pending, setPending] = useState(false);
    const [message, setMessage] = useState(null);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProductData({
            ...productData,
            [name]: value,
        });
    };

    const handleReset = () => {
        setProductData(defaultData);
    };

    const handleDelete = async (event) => {
        event.preventDefault();
        const { message, redirectPath } = await deleteProduct(product);
        setPending(false);
        setMessage(message);
        if (redirectPath) {
            router.push(redirectPath);
            router.refresh();
        }
    }

    async function handleSubmit(e) {

        e.preventDefault();
        let allValid = true;

        // Validate each form
        for (const formRef of formRefs) {
            const form = formRef.current;
            if (form) {
                // Temporarily make hidden file inputs visible for validation
                const fileInputs = form.querySelectorAll('input[type="file"]');
                fileInputs.forEach(input => {
                    if (input.style.display === 'none') {
                        input.style.display = 'block';
                        input.dataset.tempHidden = 'true'; // Mark as temporarily visible
                    }
                });

                if (!form.checkValidity()) {
                    allValid = false;
                    form.reportValidity();
                    break;
                }

                // Re-hide temporarily visible file inputs
                fileInputs.forEach(input => {
                    if (input.dataset.tempHidden) {
                        input.style.display = 'none';
                        delete input.dataset.tempHidden;
                    }
                });
            }
        }

        // send form data to the server action
        const formData = new FormData();
        Object.entries(productData).forEach(([key, value]) => {

            if (Array.isArray(value)) {
                if (value.length > 0) {
                    if (value[0] instanceof File) {
                        // Handle array of files
                        value.forEach(file => {
                            formData.append(key, file);
                        });
                    } else {
                        // Handle other types of arrays
                        formData.append(key, JSON.stringify(value));
                    }
                }
            } else {
                // Handle other types (non-array values)
                formData.append(key, value);
            }
        });

        const { message, redirectPath } = await createProduct(formData);
        setPending(false);
        setMessage(message);
        if (redirectPath) {
            router.push(redirectPath);
            router.refresh();
        }

    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', rowGap: '2.5rem' }}>
            <ProductEssentialsForNew formRef={formRefs[0]} productData={productData} handleChange={handleChange} setProductData={setProductData} />
            <MediaUploadForNew formRef={formRefs[1]} files={productData.mediaFiles} setProductData={setProductData} />
            {message && <div className="formError" style={{ margin: '0 1.5rem' }}>{message}</div>}
            <div style={{ margin: '0 1.5rem' }}>
                <Link href={pathname}>
                    <button>Cancel</button>
                </Link>
                {product
                    ? <button onClick={handleDelete} aria-disabled={pending}>Delete</button>
                    : <button type='reset' onClick={handleReset} >Reset</button>
                }
                <button type='submit' onClick={handleSubmit} aria-disabled={pending}>Create</button>
            </div>
        </div>
    );
}