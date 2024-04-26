"use client";
import React, { useState } from 'react';
import formatFileSize from '@/lib/helper/formatter';
import styles from "./NewProduct.module.css"

export default function NewProduct() {

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
    };

    const handleMediaUpload = async (event) => {

        event.preventDefault();

        if (!selectedFile) {
            console.error('No file selected.');
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("filePath", "public/videos/");

        try {
            const result = await fetch('/api/media-upload', {
                method: 'POST',
                body: formData,
            });

            console.log(result);
        } catch (error) {
            console.error(error);
        }

    };

    return (
        <div>
            <form onSubmit={handleMediaUpload}>
                <div className={styles.formGroup}>
                    <label htmlFor="fileInput">Select File:</label>
                    <input
                        id="fileInput"
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                    />
                </div>
                {/* Additional form fields can be added here */}
                <button type="submit">Submit</button>
            </form>
            {selectedFile && (
                <div>
                    <h3>Selected File:</h3>
                    <p>Name: {selectedFile.name}</p>
                    <p>Type: {selectedFile.type}</p>
                    <p>Size: {formatFileSize(selectedFile.size)}</p>
                    {selectedFile.type.startsWith('image/') && (
                        <img src={previewUrl} alt="Selected Image" style={{ maxWidth: '320px', maxHeight: '100%' }} />
                    )}
                    {selectedFile.type.startsWith('video/') && (
                        <video controls width={320} height={240}>
                            <source src={previewUrl} type={selectedFile.type} />
                            Your browser does not support the video tag.
                        </video>
                    )}
                </div>
            )}
        </div>
    );
}