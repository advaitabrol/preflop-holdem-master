import express from "express";
import { Note } from "../models/Note.mjs";
import { authenticateToken } from "./authRoutes.mjs";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId; // Assuming the token payload contains the userId
    // Find all notes for the specified user
    const notes = await Note.find({ userId });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
