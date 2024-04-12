import styles from "./Note.module.css";
import EditIcon from "./EditIcon";
import { useState } from "react";

export default function Note({ data, onDeleteNote, deleteMode }) {
  const { position, hand, handSpecific, note, _id } = data;

  const [adjustableNote, setAdjustableNote] = useState(note);
  const [inEditState, setInEditState] = useState(false);
  const [editText, setEditText] = useState(note);

  async function deleteNote() {
    try {
      const token = localStorage.getItem("accessToken"); // Get the JWT token from local storage
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/delete/${_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      // Note deleted successfully
      onDeleteNote(_id);
    } catch (error) {
      console.error("Error deleting note:", error.message);
    }
  }

  function handleEdit(event) {
    setEditText(event.target.value);
  }

  async function handleConfirmedEdit() {
    try {
      const token = localStorage.getItem("accessToken"); // Get the JWT token from local storage
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/edit/${_id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: editText }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to edit note");
      }
    } catch (error) {
      throw new Error("Error editing note");
    }
    setAdjustableNote(editText);
    setInEditState(false);
  }

  function handleEditClick() {
    setInEditState(true);
  }

  return (
    <div className={styles.note}>
      <div className={styles.note_and_delete}>
        <h3>Position: {position}</h3>
        {deleteMode && (
          <button className={styles.delete} onClick={deleteNote}>
            X
          </button>
        )}
      </div>
      {handSpecific && hand.hand && (
        <div>
          <h4>Hand: {JSON.stringify(hand.hand)}</h4>
          <p>RFI frequency: {Number(JSON.stringify(hand.percentage)) * 100}%</p>
        </div>
      )}

      {!inEditState ? (
        <div className={styles.note_and_edit}>
          <p>{adjustableNote}</p>
          <EditIcon onEditClick={handleEditClick} />
        </div>
      ) : (
        <div className={styles.note_and_edit}>
          <input type="text" value={editText} onChange={handleEdit} />
          <button onClick={handleConfirmedEdit}>Done</button>
        </div>
      )}
    </div>
  );
}
