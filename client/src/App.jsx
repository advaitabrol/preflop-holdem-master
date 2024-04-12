import { BrowserRouter, Routes, Route } from "react-router-dom";
import RFI from "./pages/RFI";
import Login from "./pages/Login";
import Notes from "./pages/Notes";
import Register from "./pages/Register";
import TempRedirect from "./pages/TempRedirect";
import { useState, useEffect } from "react";

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  function handleSignInChange() {
    setIsSignedIn((prev) => !prev);
  }

  // useEffect to listen for changes in isSignedIn state
  useEffect(() => {
    // Your logic to determine if user is signed in
    // Example: Check localStorage, user token, etc.
    const signedIn = localStorage.getItem("accessToken") ? true : false;
    setIsSignedIn(signedIn);
  }, []);

  // Redirect to "/" when isSignedIn state changes

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <RFI isSignedIn={isSignedIn} onSignInChange={handleSignInChange} />
          }
        />
        <Route
          path="/rfi"
          element={
            <RFI isSignedIn={isSignedIn} onSignInChange={handleSignInChange} />
          }
        />
        <Route
          path="/notes"
          element={
            <Notes
              isSignedIn={isSignedIn}
              onSignInChange={handleSignInChange}
            />
          }
        />
        <Route
          path="/login"
          element={<Login onSignInChange={handleSignInChange} />}
        />
        <Route
          path="/register"
          element={<Register onSignInChange={handleSignInChange} />}
        />
        <Route path="/temp-redirect" element={<TempRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
