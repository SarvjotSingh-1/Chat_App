// create user model

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      minlength: 2,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }, // created at and updated at
);

//last login

const user = mongoose.model("User", userSchema);
export default user;
