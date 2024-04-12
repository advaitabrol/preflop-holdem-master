import "./config.mjs";
import { RFIMatrix } from "./models/RFIMatrix.mjs";
import express from "express";
import passport from "passport";
import session from "express-session";
import seedData from "./data/script.mjs";
import rfiRouter from "./routes/rfi.mjs";
import noteRouter from "./routes/notes.mjs";
import authRoutes from "./routes/authRoutes.mjs";
import deleteNoteRouter from "./routes/deleteNotes.mjs";
import editNoteRouter from "./routes/editNotes.mjs";
import customizeRangeRouter from "./routes/customizeRanges.mjs";
import cors from "cors";
import flash from "connect-flash";

function useSeedData() {
  seedData().then((data) => {
    data.forEach(async (matrix) => {
      const newMatrix = new RFIMatrix({
        position: matrix.position,
        matrix: matrix.matrix,
      });

      await newMatrix.save();
    });
  });
}

const app = express();

const result = await RFIMatrix.findOne({}, "_id");
if (!result) {
  useSeedData();
}

const corsOptions = {
  origin: process.env.REACT_SERVER,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow these HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers // Allow sending cookies from the client
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(authRoutes);

app.use("/rfi", rfiRouter);
app.use("/notes", noteRouter);
app.use("/delete", deleteNoteRouter);
app.use("/edit", editNoteRouter);
app.use("/customize", customizeRangeRouter);
// Mount the note router

app.listen(process.env.PORT || 3001);
