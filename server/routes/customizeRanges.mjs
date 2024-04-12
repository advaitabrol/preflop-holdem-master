import express from "express";
import { RFIMatrix } from "../models/RFIMatrix.mjs";
import { authenticateToken } from "./authRoutes.mjs";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
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
});

router.put("/", authenticateToken, async (req, res) => {
  try {
    // Extract userID from Passport authentication
    const userId = req.user.userId;
    const position = req.query.position;
    const newMatrix = req.body.matrix;

    // Find and update the RFI matrix object in the database
    const updatedMatrix = await RFIMatrix.findOneAndUpdate(
      { position, userId },
      { $set: { matrix: newMatrix } },
      { new: true } // Return the updated document
    );

    if (!updatedMatrix) {
      return res
        .status(404)
        .json({ error: "Error updating your custom ranges" });
    }

    res.status(200).json({
      message: "RFI range updated successfully",
    });
  } catch (error) {
    console.error("Error updating RFI matrix:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
