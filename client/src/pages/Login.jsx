import PageNav from "../components/PageNav";
import styles from "./Login.module.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login({ onSignInChange }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/signin`, {
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
      console.error("login failed:", error.message);
      setError("Passwords do not match");
      setUsername("");
      setPassword("");
      setError(error.message);
    }
  };

  return (
    <div className={styles.login_container}>
      <PageNav />
      <div className={styles.form_container}>
        <form className={styles.login_box}>
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
          {error && (
            <p className={styles.error_message}>
              Log in failed. Your username or password was incorrect
            </p>
          )}
          <button onClick={handleSubmit}>Submit</button>
        </form>
        <div className={styles.register_text}>
          <p>
            Need an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
