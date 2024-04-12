import express from "express";
import { Note } from "../models/Note.mjs";
import { authenticateToken } from "./authRoutes.mjs";

const router = express.Router();

router.delete("/:noteId", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const noteId = req.params.noteId;

    // Verify that the note belongs to the requesting user
    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) {
      return res.status(404).json({ error: "Note not found or unauthorized" });
    }

    // Delete the note
    await Note.deleteOne({ _id: noteId });

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
