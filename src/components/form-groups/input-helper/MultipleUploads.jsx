"use client";
import { useRef, useState } from "react";

export default function MultipleUploads({ required, title, name, files, setFiles }) {

    const [fileUrls, setFileUrls] = useState([]);
    const [fileEnter, setFileEnter] = useState(false);
    const inputRef = useRef(null);

    const handleFileChange = (event) => {
        event.preventDefault();
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
        inputRef.current.click();
    }

    function handleDrop(e) {
        e.preventDefault();
        setFileEnter(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            for (let i = 0; i < e.dataTransfer.files["length"]; i++) {
                setFileUrls((prevState) => [...prevState, e.dataTransfer.files[i]]);
            }

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

    }
}