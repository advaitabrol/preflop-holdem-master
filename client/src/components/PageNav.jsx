import { NavLink, useNavigate } from "react-router-dom";
import styles from "./PageNav.module.css";
import { useState, useEffect } from "react";

function PageNav({ isSignedIn, onSignInChange }) {
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  const [username, setUsername] = useState(null);

  useEffect(
    function () {
      async function getUsername() {
        if (isSignedIn) {
          if (!accessToken) {
            throw new Error("Access token not found");
          }
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/username`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch username");
          }

          const data = await response.json();
          setUsername(data.username);
        }
      }
      getUsername();
    },
    [isSignedIn]
  );

  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <NavLink to="/rfi">RFI</NavLink>
        </li>
        {/*
         <li>
          <NavLink to="/vsrfi">vs RFI</NavLink>{" "}
        </li>
        <li>
          <NavLink to="/rfivs3bet">RFI vs 3BET</NavLink>
        </li>
  */}
        <li>
          <NavLink to="/notes">Notes</NavLink>{" "}
        </li>
      </ul>
      {isSignedIn ? (
        <ul>
          <div className={styles.account_txt}>
            <p>{`Signed in as ${username ? username : ""}`}</p>
            <button
              onClick={() => {
                localStorage.removeItem("accessToken");
                onSignInChange();
                navigate("/temp-redirect");
                navigate("/");
              }}
            >
              Sign Out
            </button>
          </div>{" "}
        </ul>
      ) : (
        <ul>
          <NavLink to="/login">Sign in</NavLink>
        </ul>
      )}
    </nav>
  );
}

export default PageNav;
