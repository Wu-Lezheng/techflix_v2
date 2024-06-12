"use client";
import { useRef, useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import MediaPreview from "./MediaPreview";
import styles from "./MultipleUploads.module.css";
import RequiredInput from "./RequiredInput";

export default function MultipleUploads({ required, title, name, files, setProductData }) {

    const [fileUrls, setFileUrls] = useState(files ? files.map(file => URL.createObjectURL(file)) : []);
    const [fileEnter, setFileEnter] = useState(false);
    const inputRef = useRef(null);

    function setFiles(file) {
        setProductData(prevState => ({
            ...prevState,
            mediaFiles: [...prevState.mediaFiles, file]
        }));
    }

    function handleDelete(index) {
        setProductData(prevState => ({
            ...prevState,
            mediaFiles: prevState.mediaFiles.filter((_, i) => i !== index)
        }));
        setFileUrls((prevFileUrls) => prevFileUrls.filter((_, i) => i !== index));
    }

    const handleFileChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            for (let i = 0; i < e.target.files["length"]; i++) {
                const file = e.target.files[i];
                setFiles(file);
                const url = URL.createObjectURL(file);
                setFileUrls((prevState) => [...prevState, url]);
            }
        }
    };

    function openFileExplorer() {
        inputRef.current.value = "";
        inputRef.current.click();
    }

    function handleDrop(e) {

        e.preventDefault();
        setFileEnter(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            for (let i = 0; i < e.dataTransfer.files["length"]; i++) {
                const file = e.dataTransfer.files[i];
                if (file?.type.startsWith('image/') || file?.type.startsWith('video/')) {
                    setFiles(file);
                    const url = URL.createObjectURL(file);
                    setFileUrls((prevState) => [...prevState, url]);
                }
            }
        }

    }

    return (
        <div className='normalInput'>

            <RequiredInput labelFor={name} required={required}>{title}</RequiredInput>

            <div className={styles.multiFileUpload}>
                <div
                    onDragOver={(e) => {
                        e.preventDefault();
                        setFileEnter(true);
                    }}
                    onDragLeave={(e) => {
                        e.preventDefault();
                        setFileEnter(false);
                    }}
                    onDragEnd={(e) => {
                        e.preventDefault();
                        setFileEnter(false);
                    }}
                    onDrop={handleDrop}
                    className="fileUpload"
                    style={{ width: '100%', flex: '1' }}
                >
                    <AiOutlineCloudUpload color="var(--accent)" size={"4rem"} />
                    <p className="fileUploadText">Drop your file into the box or {" "}
                        <span className="fileBrowse" onClick={openFileExplorer}>browse</span>
                    </p>
                    <input ref={inputRef} type="file" name={name} id={name} accept="image/*,video/*" multiple
                        required={required} onChange={handleFileChange} style={{ display: "none" }}
                    />
                </div>
                <div className={styles.mediaPreviews}>
                    {files?.map((file, index) => (
                        <MediaPreview key={index} file={file} fileUrl={fileUrls[index]} handleClick={() => handleDelete(index)} width="100%" />
                    ))}
                </div>
            </div>
        </div>
    );
}