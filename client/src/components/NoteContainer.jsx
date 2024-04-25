import { useState, useEffect } from "react";
import Note from "./Note";
import styles from "./NoteContainer.module.css";
import FilterDropdown from "./FilterDropdown";

export default function NoteContainer() {
  const [selectedFilter, setSelectedFilter] = useState("position");
  const [notes, setNotes] = useState([]);
  const [deleteMode, setDeleteMode] = useState(false);

  const positionOrder = {
    UTG: 1,
    UTG1: 2,
    CO: 3,
    BTN: 4,
    SB: 5,
  };

  const handOrder = {
    A: 1,
    K: 2,
    Q: 3,
    J: 4,
    T: 5,
    9: 6,
    8: 7,
    7: 8,
    6: 9,
    5: 10,
    4: 11,
    3: 12,
    2: 13,
  };

  async function onDeleteNote(noteId) {
    setNotes(notes.filter((note) => note._id !== noteId));
  }

  function handleFilterChange(e) {
    setSelectedFilter(e.target.value);
  }

  useEffect(() => {
    // Function to fetch notes from the backend
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("accessToken"); // Get the JWT token from local storage
        const response = await fetch(`${import.meta.env.VITE_API_URL}/notes`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Pass the JWT token as Authorization header
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch notes");
        }

        const data = await response.json();
        setNotes(data); // Set the notes state with the fetched data
      } catch (error) {
        console.error("Error fetching notes:", error.message);
      }
    };

    fetchNotes(); // Call the fetchNotes function when the component mounts
  }, []); // Empty dependency array ensures the effect runs only once

  useEffect(() => {
    if (!notes) {
      return;
    }
    if (selectedFilter === "position") {
      setNotes((curNotes) =>
        curNotes.slice().sort((prev, cur) => {
          const prevValue =
            positionOrder[prev.position] || Number.MAX_SAFE_INTEGER;
          const curValue =
            positionOrder[cur.position] || Number.MAX_SAFE_INTEGER;

          // Compare the position values
          return prevValue - curValue;
        })
      );
    } else if (selectedFilter === "hand") {
      setNotes((curNotes) =>
        curNotes.slice().sort((prev, cur) => {
          // Get the hand values for the current and previous notes
          const prevValue =
            (prev.hand && handOrder[prev.hand.hand.charAt(0)]) ||
            Number.MAX_SAFE_INTEGER;
          const curValue =
            (cur.hand && handOrder[cur.hand.hand.charAt(0)]) ||
            Number.MAX_SAFE_INTEGER;

          // Compare the hand values
          if (prevValue !== curValue) {
            return prevValue - curValue; // Sort by the first character (rank) of the hand
          } else {
            // If ranks are the same or hands are undefined, sort by the second character (suit) of the hand
            return (
              (prev.hand?.hand.charAt(1) || "") -
              (cur.hand?.hand.charAt(1) || "")
            );
          }
        })
      );
    }
  }, [selectedFilter]);
  return (
    <div>
      <FilterDropdown
        selectedFilter={selectedFilter}
        onFilterChange={handleFilterChange}
      />
      <div>
        {notes.map((data) => (
          <Note
            key={data._id}
            data={data}
            onDeleteNote={onDeleteNote}
            deleteMode={deleteMode}
          />
        ))}
      </div>
      <button
        className={styles.delete_btn}
        onClick={() => setDeleteMode((prev) => !prev)}
      >
        {!deleteMode ? "Delete Notes" : "Done"}
      </button>
    </div>
  );
}
