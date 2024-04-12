import styles from "./RFISelection.module.css";

export default function RFISelection({ RFIPosition, handlePositionChange }) {
  return (
    <div className={styles.general}>
      <select
        className="select_position"
        value={RFIPosition}
        onChange={handlePositionChange}
      >
        <option value="UTG">UTG</option>
        <option value="UTG1">UTG1</option>
        <option value="CO">CO</option>
        <option value="BTN">BTN</option>
        <option value="SB">SB</option>
      </select>
    </div>
  );
}
