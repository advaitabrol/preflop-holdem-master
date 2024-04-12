// 1ST DRAFT DATA MODEL
import mongoose from "mongoose";
mongoose.connect(process.env.DSN);

// RFI
// * Each RFI Matrix holds a position, coressponding to the poker position it pertains to (eg: Small Blind)
// * Each RFI Matrix also holds a matrix array, representing the hand matrix it displays.
// * In the future, the RFI matrix will also probably hold a user it relates too, so that customization is enabled.
const RFIMatrixSchema = new mongoose.Schema({
  position: { type: String, required: true },
  matrix: { type: Object, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
});

export const RFIMatrix = mongoose.model("RFIMatrix", RFIMatrixSchema);
//const vsRFI = mongoose.model('vsRFI', vsRFISchema);
//const RFIvs3BET = mongoose.model('RFIvs3BET', RFIvs3BETSchema);
//const vs4BET = mongoose.model('vs4BET', vs4BETSchema);
//const Note = mongoose.model('Note', NoteSchema);
