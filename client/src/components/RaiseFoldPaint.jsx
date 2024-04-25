import PaintBrushIcon from "./PaintBrushIcon";
import styles from "./RaiseFoldPaint.module.css";

function RaiseFoldPaint({ paintButton, onPaintSelection }) {
  return (
    <div className={styles.raisefoldpaint_container}>
      <PaintBrushIcon />
      <div className={styles.buttons_container}>
        <button
          value="raise"
          className={`${styles.raise_button} ${
            paintButton === "raise" ? `${styles.selected}` : ""
          }`}
          onClick={(event) => onPaintSelection(event.target.value)}
        >
          Raise
        </button>
        <button
          value="fold"
          className={`${styles.fold_button} ${
            paintButton === "fold" ? `${styles.selected}` : ""
          }`}
          onClick={(event) => onPaintSelection(event.target.value)}
        >
          Fold
        </button>
      </div>
    </div>
  );
}

export default RaiseFoldPaint;
