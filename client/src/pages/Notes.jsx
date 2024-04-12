import NoteContainer from "../components/NoteContainer";
import PageNav from "../components/PageNav";
import styles from "./Notes.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Notes({ isSignedIn, onSignInChange }) {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const validState = accessToken ? true : false;

  useEffect(() => {
    if (!validState) {
      navigate("/login");
    }
  }, []); // Empty dependency array to ensure useEffect runs only once on mount

  // If user is not authenticated, useEffect will navigate to "/login" before rendering
  if (!validState) {
    return null; // or loading indicator, depending on your UI/UX requirements
  }

  // If user is authenticated, render the component
  return (
    <div className={styles.container}>
      <PageNav isSignedIn={isSignedIn} onSignInChange={onSignInChange} />
      <NoteContainer />
    </div>
  );
}
