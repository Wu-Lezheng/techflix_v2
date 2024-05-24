export default function RequiredInput({ children, required }) {
    return (
        <p>
            {children} {required && <span style={{ color: 'red' }}>*</span>}
        </p>
    );
};