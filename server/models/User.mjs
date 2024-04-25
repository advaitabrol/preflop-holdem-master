import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;
mongoose.connect(process.env.DSN);

const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

// Hash the password before saving it to the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

// Method to compare passwords
userSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const User = model("User", userSchema);
