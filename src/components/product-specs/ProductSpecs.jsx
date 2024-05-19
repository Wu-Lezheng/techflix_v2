import styles from "./ProductSpecs.module.css";

export default function ProductSpecs({ specs }) {

    return (
        <div className={styles.specsContainer}>
            {specs.map((spec, index) => (
                <div key={spec.id}>
                    <h4>{spec.specType}</h4>
                    {spec.value.split('\n').map((line, index) => (
                        <p>{line}</p>
                    ))}
                    {index !== specs.length - 1 && <br />}
                </div>
            ))}
        </div>
    );
}