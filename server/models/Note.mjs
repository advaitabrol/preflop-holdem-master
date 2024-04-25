import mongoose from "mongoose";
mongoose.connect(process.env.DSN);

const NoteSchema = new mongoose.Schema({
  position: { type: String, required: true },
  hand: { type: Object },
  handSpecific: { type: Boolean, required: true },
  note: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  noteId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
});

export const Note = mongoose.model("Note", NoteSchema);
