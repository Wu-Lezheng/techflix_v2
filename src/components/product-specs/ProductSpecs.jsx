import styles from "./ProductSpecs.module.css";

export default function ProductSpecs({ specs }) {

    return (
        <div className={styles.specsContainer}>
            {specs.map((spec, index) => (
                <div key={spec.id}>
                    <h4 className={styles.title}>{spec.specType}</h4>
                    {spec.value.split('\n').map((line, index) => (
                        <p className={styles.value}>{line}</p>
                    ))}
                    {index !== specs.length - 1 && <br />}
                </div>
            ))}
        </div>
    );
}