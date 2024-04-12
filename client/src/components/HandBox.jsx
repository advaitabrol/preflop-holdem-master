import styles from "./HandBox.module.css";

export default function HandBox({ hand, raisePercentage }) {
  let color = "red"; // Default color
  if (raisePercentage > 66) {
    color = "green";
  } else if (raisePercentage > 33) {
    color = "yellow";
  }
  return (
    <div className={styles.hand_box}>
      <div className={styles.hand}>{hand}</div>
      <div className={styles.raise} style={{ color }}>
        {raisePercentage}%
      </div>
    </div>
  );
}
