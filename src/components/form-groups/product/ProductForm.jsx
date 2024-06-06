"use client";
import { createProduct, deleteProduct } from "@/lib/server-actions/productActions";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import path from "path";
import { useEffect, useRef, useState } from "react";
import MediaUploadForNew from "./MediaUploadForNew";
import ProductEssentialsForNew from "./ProductEssentialsForNew";

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
    const [pending, setPending] = useState(false);
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
            try {
                const files = await Promise.all(mediaFiles.map(async (mediaFile) => {
                    const filename = path.basename(mediaFile.filePath);
                    const response = await fetch(mediaFile.filePath);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const blob = await response.blob();
                    return new File([blob], filename, { type: blob.type });
                }));

                setProductData(prevData => ({ ...prevData, mediaFiles: files }));
            } catch (error) {
                console.log(error);
            }
        }

        fetchCover();
        fetchMediaFiles();
    }, [product]);

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
            {product
                ? productData.coverImage !== '' && <ProductEssentialsForNew formRef={formRefs[0]} productData={productData} handleChange={handleChange} setProductData={setProductData} />
                : <ProductEssentialsForNew formRef={formRefs[0]} productData={productData} handleChange={handleChange} setProductData={setProductData} />
            }
            {mediaFiles?.length > 0
                ? productData.mediaFiles?.length === mediaFiles?.length && <MediaUploadForNew formRef={formRefs[1]} files={productData.mediaFiles} setProductData={setProductData} />
                : <MediaUploadForNew formRef={formRefs[1]} files={productData.mediaFiles} setProductData={setProductData} />
            }
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