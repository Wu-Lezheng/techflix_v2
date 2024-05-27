export default function RequiredInput({ children, required, labelFor }) {
    return (
        <label htmlFor={labelFor}>{children} {required && <span style={{ color: 'red' }}>*</span>}</label>
    );
};