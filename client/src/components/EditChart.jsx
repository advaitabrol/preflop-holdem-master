import styles from "./EditChart.module.css";
import EditBox from "./EditBox";
import { useState } from "react";
import RaiseFoldPaint from "./RaiseFoldPaint";

export default function EditChart({
  currentMatrix,
  onCancel,
  onEditHand,
  onConfirm,
}) {
  const [paintButton, setPaintButton] = useState(null);

  function handlePaintSelection(value) {
    if (paintButton === value) {
      setPaintButton(null); // Deselect if already selected
    } else {
      setPaintButton(value);
    }
  }

  const rows = [];
  for (let i = 0; i < currentMatrix.length; i += 13) {
    rows.push(currentMatrix.slice(i, i + 13));
  }

  return (
    <div className={styles.chart_container}>
      <div className={styles.matrix_grid}>
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {row.map((hand, colIndex) => (
              <div
                className={styles.row_and_hover}
                key={`${rowIndex}-${colIndex}`}
              >
                <EditBox
                  key={`${rowIndex}-${colIndex}`}
                  keyCopy={`${rowIndex}-${colIndex}`}
                  hand={hand}
                  paintButton={paintButton}
                  onEditHand={onEditHand}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className={styles.bottom_panel}>
        <RaiseFoldPaint
          onPaintSelection={handlePaintSelection}
          paintButton={paintButton}
        />
        <button className={styles.customize} onClick={onConfirm}>
          Confirm Edits
        </button>
        <button className={styles.customize} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
