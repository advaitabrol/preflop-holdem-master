// authRoutes.js
import express from "express";
import { passport, jwt } from "./passportConfig.mjs";
import { User } from "../models/User.mjs";

const router = express.Router();
// Middleware to verify JWT token
export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden - Invalid token" });
    }
    req.user = user;
    next();
  });
}

// Sign-in route
router.post("/signin", passport.authenticate("local"), (req, res) => {
  const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET);
  res.json({ token });
});

// Register route
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }
    const newUser = new User({ username, password });
    await newUser.save();
    // Automatically log in the new user after registration
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);
    // Return the token to the client
    res.status(200).json({ token });
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
});

router.get("/username", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ username: user.username });
  } catch (error) {
    console.error("Error fetching username:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Logout route
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

export default router;
