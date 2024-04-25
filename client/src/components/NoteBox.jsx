import { useState } from "react";
import styles from "./NoteBox.module.css";
import HandBox from "./HandBox";
import { NavLink } from "react-router-dom";

export default function NoteBox({ selectedHand, position }) {
  const [noteType, setNoteType] = useState("general");
  const [noteContent, setNoteContent] = useState("");
  const [showHandBox, setShowHandBox] = useState(false);
  const [error, setError] = useState("");

  function toggleHandBox(e) {
    setNoteType(e.target.value);
    if (e.target.value === "handSpecific") {
      setShowHandBox(true);
    } else {
      setShowHandBox(false);
    }
  }

  function submitNote(event) {
    event.preventDefault();

    if (noteType === "handSpecific" && !selectedHand.hand) {
      setError("Please select a hand for hand-specific notes.");
    } else if (noteContent === "") {
      setError("You cannot submit an empty note.");
    } else {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setError("Sign-in");
        return;
      }

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the JWT token in the Authorization header
        },
        body: JSON.stringify({
          position: position,
          hand: selectedHand,
          handSpecific: noteType === "handSpecific", // Assuming noteType will be 'handSpecific' if hand-specific note is selected
          note: noteContent,
        }),
      };

      fetch(`${import.meta.env.VITE_API_URL}/rfi/notes`, requestOptions)
        .then((response) => {
          if (!response.ok) {
            setError("Failed to Create Note");
            throw new Error("Failed to create note");
          }
          return response.json();
        })
        .then(() => {
          setNoteContent("");
          setNoteType("general");
          setShowHandBox(false);
          setError("");
        })
        .catch((error) => {
          setError("Error creating note");
          console.error("Error creating note:", error);
          // Handle error (e.g., display error message to user)
        });
    }
  }

  return (
    <form className={styles.NoteBox}>
      <label>Note Type:</label>
      <div className={`${styles.margin_bottom} ${styles.radio_buttons}`}>
        <label>
          <input
            type="checkbox"
            name="general"
            value="general"
            checked={noteType === "general"}
            onChange={toggleHandBox}
          />
          General Note
        </label>
        <label>
          <input
            type="checkbox"
            name="handSpecific"
            value="handSpecific"
            checked={noteType === "handSpecific"}
            onChange={toggleHandBox}
          />
          Hand-Specific Note
        </label>
      </div>

      {showHandBox && selectedHand.hand && (
        <div className={styles.margin_bottom}>
          <HandBox
            hand={selectedHand.hand}
            raisePercentage={selectedHand.percentage * 100}
          />
        </div>
      )}

      <label htmlFor="noteContent">Note:</label>
      <textarea
        className={styles.margin_bottom}
        id="noteContent"
        rows="4"
        cols="50"
        value={noteContent}
        onChange={(e) => setNoteContent(e.target.value)}
      ></textarea>

      <button onClick={submitNote} className={styles.margin_bottom}>
        Submit
      </button>

      {error &&
        (error === "Sign-in" ? (
          <NavLink to="/login">Sign in here make notes</NavLink>
        ) : (
          <p className={styles.hand_selection_message}>{error}</p>
        ))}
    </form>
  );
}
