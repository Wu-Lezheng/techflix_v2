export function formatFileSize(sizeInBytes) {
    if (sizeInBytes < 1024) {
        return sizeInBytes + ' bytes';
    } else if (sizeInBytes < 1024 * 1024) {
        return (sizeInBytes / 1024).toFixed(2) + ' KB';
    } else if (sizeInBytes < 1024 * 1024 * 1024) {
        return (sizeInBytes / (1024 * 1024)).toFixed(2) + ' MB';
    } else {
        return (sizeInBytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    }
}

export function formatDate(dateTime) {
    return new Date(dateTime).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

export function formatViews(num) {
    if (num < 1000) {
        return num;
    } else if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'm';
    } else {
        return (num / 1000).toFixed(1) + 'k';
    }
}

export function formatParagraph(text) {
    return (
        <>
            {text.split('\n').map((line, index) => (
                <p key={index} style={{ color: "inherit" }}>{line}</p>
            ))}
        </>
    )
}