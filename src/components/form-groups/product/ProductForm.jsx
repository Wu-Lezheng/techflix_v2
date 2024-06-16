"use client";
import { createProduct, deleteProduct, updateProduct } from "@/lib/server-actions/productActions";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import path from "path";
import { useEffect, useRef, useState } from "react";
import MediaUpload from "./MediaUpload";
import ProductEssentials from "./ProductEssentials";

export default function ProductForm({ product, mediaFiles }) {

    const pathname = usePathname();
    const router = useRouter();

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
    const [pending, setPending] = useState(product ? true : false);
    const [message, setMessage] = useState(null);

    useEffect(() => {

        if (!product) return;

        async function fetchCover() {
            try {
                const filename = path.basename(product.coverImage);
                const response = await fetch(product.coverImage);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const blob = await response.blob();
                const file = new File([blob], filename, { type: blob.type });
                setProductData(prevData => ({ ...prevData, coverImage: file }));;

            } catch (error) {
                console.log(error);
            }
        }

        async function fetchMediaFiles() {
            const files = await Promise.all(mediaFiles.map(async (mediaFile) => {
                try {
                    const filename = path.basename(mediaFile.filePath);
                    const response = await fetch(mediaFile.filePath);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch ${mediaFile.filePath}`);
                    }
                    const blob = await response.blob();
                    return new File([blob], filename, { type: blob.type });
                } catch (error) {
                    console.log(`Error fetching ${mediaFile.filePath}: ${error.message}`);
                    return;
                }
            }));

            setProductData(prevData => ({ ...prevData, mediaFiles: files }));
        }

        async function initialise() {
            await Promise.all([fetchCover(), fetchMediaFiles()]);
            setPending(false);
        }

        initialise();
    }, [product, mediaFiles]);

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

    function validateForms() {
        let allValid = true;
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
        return allValid;
    }

    function formatFormData() {
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
        return formData;
    }

    async function handleSubmit(e) {

        e.preventDefault();

        // Validate each form
        const formValid = validateForms();

        if (formValid) {
            // send form data to the server action
            const formData = formatFormData();

            const { message, redirectPath } = product ? await updateProduct(product, formData) : await createProduct(formData);
            setPending(false);
            setMessage(message);
            if (redirectPath) {
                router.push(redirectPath);
                router.refresh();
            }
        }

    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', rowGap: '2.5rem' }}>

            {product
                ? !pending && <>
                    <ProductEssentials formRef={formRefs[0]} productData={productData} handleChange={handleChange} setProductData={setProductData} />
                    <MediaUpload formRef={formRefs[1]} files={productData.mediaFiles} setProductData={setProductData} />
                </>
                : <>
                    <ProductEssentials formRef={formRefs[0]} productData={productData} handleChange={handleChange} setProductData={setProductData} />
                    <MediaUpload formRef={formRefs[1]} files={productData.mediaFiles} setProductData={setProductData} />
                </>
            }

            {message && <div className="formError" style={{ margin: '0 1.5rem' }}>{message}</div>}

            <div className="formButtonGroup" style={{ margin: '0 1.5rem' }}>
                <Link href={pathname}>
                    <button aria-disabled={pending} className="formButton" style={{ fontWeight: 'var(--medium)' }}>Cancel</button>
                </Link>
                {product
                    ? <button onClick={handleDelete} aria-disabled={pending} className="formButton">Delete</button>
                    : <button type='reset' onClick={handleReset} className="formButton">Reset</button>
                }
                <button type='submit' onClick={handleSubmit} aria-disabled={pending} className="formButton">{product ? "Update" : "Create"}</button>
            </div>

        </div>
    );
}