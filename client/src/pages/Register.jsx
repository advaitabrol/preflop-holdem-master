import PageNav from "../components/PageNav";
import styles from "./Register.module.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register({ onSignInChange }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleConfirmPasswordChange(event) {
    setConfirmPassword(event.target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate password and confirm password match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      return;
    }

    try {
      // Send registration data to server
      const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        setError(errorMessage);
        return;
      }

      const data = await response.json();
      // Save the token to local storage
      localStorage.setItem("accessToken", data.token);
      onSignInChange();
      navigate("/");
    } catch (error) {
      console.error("Registration failed:", error.message);
      setError("Passwords do not match");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setError(error.message);
    }
  };

  return (
    <div className={styles.register_container}>
      <PageNav />
      <div className={styles.form_container}>
        <form className={styles.register_box}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
          {error && <p className={styles.error_message}>{error}</p>}
          <button onClick={handleSubmit}>Submit</button>
        </form>
        <div className={styles.login_text}>
          <p>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
