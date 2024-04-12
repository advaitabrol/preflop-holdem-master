import RFISelection from "../components/RFISelection";
import PageNav from "../components/PageNav";
import Chart from "../components/Chart";
import EditChart from "../components/EditChart";
import NoteBox from "../components/NoteBox";
import styles from "./RFI.module.css";
import { useEffect, useState } from "react";

export default function RFI({ isSignedIn, onSignInChange }) {
  const [RFIPosition, setRFIPosition] = useState("UTG");
  const [currentMatrix, setCurrentMatrix] = useState({});
  const [selectedHand, setSelectedHand] = useState({});
  const [editRange, setEditRange] = useState(false);

  function handleHandSelection(hand) {
    if (hand === selectedHand) {
      setSelectedHand({});
      return;
    }
    setSelectedHand(hand);
  }

  async function handleCustomize() {
    try {
      const token = localStorage.getItem("accessToken"); // Get the JWT token from local storage
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/customize?position=${RFIPosition}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to retrieve customized range");
      }
      const data = await response.json();
      setCurrentMatrix(data.matrix.matrix);
      setEditRange((prev) => !prev);
    } catch (error) {
      console.error("Error customizing range:", error.message);
    }
  }

  function handleHandEdit(hand, percentage) {
    setCurrentMatrix((prev) =>
      prev.map((element) => {
        if (element.hand === hand) {
          return { ...element, percentage: percentage };
        }
        return element;
      })
    );
  }

  function handleCancel() {
    setEditRange((prev) => !prev);
  }

  async function handleConfirmCustomization() {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/customize?position=${RFIPosition}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Assuming you have an access token
          },
          body: JSON.stringify({ matrix: currentMatrix }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update RFI matrix");
      }
      setEditRange((prev) => !prev);
    } catch (error) {
      console.error("Error updating RFI matrix:", error);
    }
  }

  async function onPositionChangeData(position) {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/rfi/${position}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Assuming you have an access token
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const responseData = await response.json();
      setCurrentMatrix(responseData.matrix);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    onPositionChangeData(RFIPosition);
  }, [RFIPosition, isSignedIn]);

  function handlePositionChange(event) {
    setRFIPosition(event.target.value);
    onPositionChangeData(event.target.value);
    setSelectedHand({});
  }

  return (
    <div className={styles.container}>
      <PageNav isSignedIn={isSignedIn} onSignInChange={onSignInChange} />
      <div className={styles.main_content}>
        <RFISelection
          RFIPosition={RFIPosition}
          handlePositionChange={handlePositionChange}
        />
        <div className={styles.chart_notes}>
          {!editRange ? (
            <Chart
              RFIPosition={RFIPosition}
              currentMatrix={currentMatrix}
              onHandSelection={handleHandSelection}
              selectedHand={selectedHand}
              onCustomize={handleCustomize}
            />
          ) : (
            <EditChart
              RFIPosition={RFIPosition}
              currentMatrix={currentMatrix}
              onCancel={handleCancel}
              onEditHand={handleHandEdit}
              onConfirm={handleConfirmCustomization}
            />
          )}
          <NoteBox selectedHand={selectedHand} position={RFIPosition} />
        </div>
      </div>
    </div>
  );
}
