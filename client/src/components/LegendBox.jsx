import styles from "./LegendBox.module.css";

export default function LegendBox() {
  return (
    <div className={styles.legend_box}>
      <div className={styles.legend_item}>
        <div className={`${styles.color_box} ${styles.raise}`}></div>
        Raise
      </div>
      <div className={styles.legend_item}>
        <div className={`${styles.color_box} ${styles.fold}`}></div>
        Fold
      </div>
    </div>
  );
}
