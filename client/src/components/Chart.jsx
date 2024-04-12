import styles from "./Chart.module.css";
import HandBox from "./HandBox";
import LegendBox from "./LegendBox";
import RowBox from "./RowBox";
import { useState } from "react";

export default function Chart({
  currentMatrix,
  onHandSelection,
  selectedHand,
  onCustomize,
}) {
  const [hoveredBox, setHoveredBox] = useState("");
  const [hoverTimer, setHoverTimer] = useState(null);

  function onBoxHover(key) {
    // Set a new timeout to execute the function after one second
    const newTimer = setTimeout(() => {
      setHoveredBox(key);
    }, 1000);

    setHoverTimer(newTimer); // 1000 milliseconds = 1 second
  }

  function onBoxLeave() {
    clearTimeout(hoverTimer);
    setHoveredBox("");
  }

  const rows = [];
  for (let i = 0; i < currentMatrix.length; i += 13) {
    rows.push(currentMatrix.slice(i, i + 13));
  }

  const hoveredBoxDetails = hoveredBox.split("-");
  const hoveredHand = hoveredBox
    ? rows[Number(hoveredBoxDetails[0])][Number(hoveredBoxDetails[1])]
    : 0;

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
                <RowBox
                  key={`${rowIndex}-${colIndex}`}
                  keyCopy={`${rowIndex}-${colIndex}`}
                  hand={hand}
                  selectedHand={selectedHand}
                  onHandSelection={onHandSelection}
                  onBoxHover={onBoxHover}
                  onBoxLeave={onBoxLeave}
                  hoveredBox={hoveredBox}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className={styles.legend_hover}>
        <LegendBox />
        {hoveredHand ? (
          <HandBox
            hand={hoveredHand.hand}
            raisePercentage={Number(hoveredHand.percentage) * 100}
          />
        ) : selectedHand.hand ? (
          <HandBox
            hand={selectedHand.hand}
            raisePercentage={selectedHand.percentage * 100}
          />
        ) : (
          ""
        )}
        <button className={styles.customize} onClick={onCustomize}>
          Customize
        </button>
      </div>
    </div>
  );
}
