"use client";
import { formatFileSize } from "@/lib/helper/formatter";
import Image from "next/image";
import { useRef, useState } from "react";
import { AiFillDelete, AiOutlineCloudUpload } from "react-icons/ai";
import RequiredInput from "./RequiredInput";

export default function SingleUpload({ required, title, name, file, setFile }) {

    const [fileUrl, setFileUrl] = useState(null);
    const [fileEnter, setFileEnter] = useState(false);
    const inputRef = useRef(null);

    const handleFileChange = (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        if (file) {
            setFile(file);
            const url = URL.createObjectURL(file);
            setFileUrl(url);
        }
    };

    function openFileExplorer() {
        inputRef.current.value = "";
        inputRef.current.click();
    }

    function handleDrop(e) {
        e.preventDefault();
        setFileEnter(false);

        if (e.dataTransfer.items) {
            for (let i = 0; i < e.dataTransfer.items.length; i++) {
                const item = e.dataTransfer.items[i];
                if (item.kind === "file") {
                    const file = item.getAsFile();
                    if (file && file.type.startsWith('image/')) {
                        setFile(file)
                        const url = URL.createObjectURL(file);
                        setFileUrl(url);
                        break;
                    }
                }
            }
        } else {
            for (let i = 0; i < e.dataTransfer.files["length"]; i++) {
                const file = e.dataTransfer.files[i];
                if (file && file.type.startsWith('image/')) {
                    setFile(file)
                    const url = URL.createObjectURL(file);
                    setFileUrl(url);
                    break;
                }
            }
        }
    }

    return (
        <div className='normalInput' style={{ width: '60%' }}>
            <RequiredInput labelFor={name} required={required}>{title}</RequiredInput>
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setFileEnter(true);
                }}
                onDragLeave={(e) => {
                    setFileEnter(false);
                }}
                onDragEnd={(e) => {
                    e.preventDefault();
                    setFileEnter(false);
                }}
                onDrop={handleDrop}
                className="fileUpload"
                style={file && { display: "none" }}
            >
                <AiOutlineCloudUpload color="var(--accent)" size={"4rem"} />
                <p className="fileUploadText">Drop your file into the box or {" "}
                    <span className="fileBrowse" onClick={openFileExplorer}>browse</span>
                </p>
                <input ref={inputRef} type="file" name={name} id={name} accept="image/*"
                    required={required} onChange={handleFileChange} style={{ display: "none" }}
                />
            </div>
            {file && (
                <div className="previewContainer">
                    <div>
                        <Image src={fileUrl} alt={file?.name} priority width={1920} height={1080} className="previewImage"></Image>
                        <div>
                            <p>{file?.name}</p>
                            <p>{formatFileSize(file?.size)}</p>
                        </div>
                    </div>
                    <AiFillDelete />
                </div>
            )}
        </div>
    );
}