import styles from "./RowBox.module.css";

export default function RowBox({
  hand,
  selectedHand,
  onHandSelection,
  keyCopy,
  onBoxHover,
  onBoxLeave,
}) {
  return (
    <div
      className={`${styles.row_box} ${styles.hand} ${
        hand.hand === selectedHand.hand ? styles.selected_box : ""
      }`}
      style={{ "--percentage": `${hand.percentage * 100}%` }}
      onClick={() => onHandSelection(hand)}
      onMouseEnter={() => onBoxHover(keyCopy)}
      onMouseLeave={() => onBoxLeave()}
    >
      {hand.hand}
    </div>
  );
}
