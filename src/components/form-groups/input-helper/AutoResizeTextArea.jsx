"use client";
import { useEffect, useRef } from "react";

export default function AutoResizeTextArea({ name, required, placeholder }) {

    const textareaRef = useRef(null);

    useEffect(() => {
        const textarea = textareaRef.current;

        const autoResizeTextarea = () => {
            textarea.style.height = 'auto'; // Reset height to auto
            textarea.style.height = `${textarea.scrollHeight}px`; // Set height to scrollHeight
        };

        // Initial call to set the height based on initial content (if any)
        autoResizeTextarea();

        // Add event listener for input events
        textarea.addEventListener('input', autoResizeTextarea);

        // Cleanup function to remove event listener
        return () => {
            textarea.removeEventListener('input', autoResizeTextarea);
        };
    }, []);

    return (
        <textarea
            ref={textareaRef}
            name={name}
            id={name}
            className="longTextField"
            required={required}
            placeholder={placeholder}
        ></textarea>
    );
}