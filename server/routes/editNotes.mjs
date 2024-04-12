import express from "express";
import { Note } from "../models/Note.mjs";
import { authenticateToken } from "./authRoutes.mjs";

const router = express.Router();

router.put("/:noteId", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const noteId = req.params.noteId;
    const newMessage = req.body.message; // Assuming message is passed in the request body

    // Verify that the note belongs to the requesting user
    const note = await Note.findOneAndUpdate(
      { _id: noteId, userId },
      { note: newMessage },
      { new: true } // Return the updated document
    );

    if (!note) {
      return res.status(404).json({ error: "Note not found or unauthorized" });
    }

    res.status(200).json({ message: "Note edited successfully", note });
  } catch (error) {
    console.error("Error editing note:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
