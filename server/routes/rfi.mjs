import express from "express";
import { RFIMatrix } from "../models/RFIMatrix.mjs";
import mongoose from "mongoose";
import { authenticateToken } from "./authRoutes.mjs";
import { Note } from "../models/Note.mjs";
import { User } from "../models/User.mjs";
import { jwt } from "./passportConfig.mjs";

const router = express.Router();

router.get("/:position", async (req, res) => {
  try {
    const { position } = req.params;
    let userId = null;

    // Attempt to authenticate the token
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (!err) {
          userId = user.userId;
        }
      });
    }

    // Find an RFI matrix with the provided position and userID
    let data = null;
    if (userId) {
      data = await RFIMatrix.findOne({ position, userId });
    }

    // If matrix is not found, find the default matrix
    if (!data) {
      data = await RFIMatrix.findOne({ position, userId: null });
    }

    // If matrix is still not found, return a 404 response
    if (!data) {
      return res
        .status(404)
        .json({ message: "Data not found for the selected position" });
    }

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }

  /*
  try {
    const userId = req.user.userId;
    const position = req.query.position;

    // Verify that the note belongs to the requesting user
    let matrix = await RFIMatrix.findOne({ position, userId });

    if (!matrix) {
      const defaultMatrix = await RFIMatrix.findOne({ position, userId: null });

      if (!defaultMatrix) {
        return res.status(404).json({ error: "Default RFI matrix not found" });
      }

      // Create a new matrix using the data of the default matrix with the added userID
      matrix = new RFIMatrix({
        position: defaultMatrix.position,
        matrix: defaultMatrix.matrix,
        userId: userId,
      });

      // Save the new matrix to the database
      await matrix.save();
    }
    res
      .status(200)
      .json({ message: "personal matrix retrieved", matrix: matrix });
  } catch (error) {
    console.error("Error finding customizable matrix:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  */
});

router.post("/notes", authenticateToken, async (req, res) => {
  try {
    const { position, hand, handSpecific, note } = req.body;
    const userId = req.user.userId; // Assuming the token payload contains the userId

    // Check if the user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const noteId = new mongoose.Types.ObjectId();
    // Create the note
    const newNote = new Note({
      position,
      hand,
      handSpecific,
      note,
      userId,
      noteId,
    });
    console.log(newNote);
    await newNote.save();

    res.status(201).json({ message: "Note created successfully" });
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
