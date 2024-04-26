export default function getFileExtension(fileName) {
    const dotIndex = fileName.lastIndexOf('.');
    if (dotIndex !== -1 && dotIndex !== 0 && dotIndex !== fileName.length - 1) {
        return fileName.substring(dotIndex);
    } else {
        console.error('The file does not have any extension');
        return '';
    }
}