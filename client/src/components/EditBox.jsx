import styles from "./EditBox.module.css";
import { useState } from "react";

export default function EditBox({ hand, paintButton, onEditHand }) {
  const [editPercentage, setEditPercentage] = useState(hand.percentage * 100);

  function handleInputChange(e) {
    const value = e.target.value;
    // Ensure the input is a valid percentage (0-100)
    if (!isNaN(value) && value >= 0 && value <= 100) {
      setEditPercentage(value);
    }
  }

  function handleInputFocus() {
    setEditPercentage("");
  }

  function handleBoxClick() {
    if (paintButton) {
      setEditPercentage(() => {
        const newPercentage = paintButton === "raise" ? 100 : 0;
        // Call onEditHand with the updated percentage value
        onEditHand(hand.hand, newPercentage / 100);
        return newPercentage;
      });
    }
  }

  function handleBlur() {
    onEditHand(hand.hand, Number(editPercentage) / 100);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      onEditHand(hand.hand, Number(editPercentage) / 100);
    }
  }

  return (
    <div
      className={`${styles.edit_box} ${styles.hand} 
      `}
      style={{ "--percentage": `${editPercentage}%` }}
      onClick={handleBoxClick}
    >
      <p className={styles.handCorner}>{hand.hand}</p>
      <div className={styles.percentage_input}>
        <input
          type="number"
          value={editPercentage}
          className={styles.percentage_field}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
        <span className={styles.percentage_sign}>%</span>
      </div>
    </div>
  );
}
