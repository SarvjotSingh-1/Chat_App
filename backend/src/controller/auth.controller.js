import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.jwt.js";
export const signup = async (req, res) => {
  //   res.send("signup end point ");

  const { fullName, email, password } = req.body;

  try {
    // checks
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    // check email is vadlid

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email is not valid" });
    }
    // if email already exist

    const user = await User.findOne({ email: email });
    if (user) return res.status(400).json({ message: "Email already exist" });

    // user hashed paddword
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new User
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      //   generateToken(newUser._id, res);
      //   await newUser.save();

      // persist user first, then issue auth cookie
      const saveUser = await newUser.save();
      generateToken(save);
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
        message: "User created successfully",
      });

      //  todo : send a welcome email to user
    } else {
      res.status(400).json({ message: "Invalid User data" });
    }
  } catch (error) {
    console.log("error in signup controller");
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
