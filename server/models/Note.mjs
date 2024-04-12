// 1ST DRAFT DATA MODEL
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
//const vsRFI = mongoose.model('vsRFI', vsRFISchema);
//const RFIvs3BET = mongoose.model('RFIvs3BET', RFIvs3BETSchema);
//const vs4BET = mongoose.model('vs4BET', vs4BETSchema);
//const Note = mongoose.model('Note', NoteSchema);
