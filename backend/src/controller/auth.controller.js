import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.jwt.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
// import "dotenv/config";
import { ENV } from "../lib/env.js";
// import cloudinary from "../lib/cloudinary.js";
import cloudinary from "../lib/cloudinary.js";

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
      const savedUser = await newUser.save();
      generateToken(savedUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
        message: "User created successfully",
      });

      //  todo : send a welcome email to user

      //   try {
      //     await sendWelcomeEmail(
      //       savedUser.email,
      //       savedUser.fullName,
      //       process.env.CLIENT_URL,
      //     );
      //   } catch (error) {
      //     console.error("Failed to send welcome email:", error);
      //   }

      try {
        await sendWelcomeEmail(
          savedUser.email,
          savedUser.fullName,
          ENV.CLIENT_URL,
        );
      } catch (error) {
        console.error("Failed to send welcome email:", error);
      }
    } else {
      res.status(400).json({ message: "Invalid User data" });
    }
  } catch (error) {
    console.log("error in signup controller", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const login = async (req, res) => {
  //   res.send("login end point ");

  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "All fields are required" });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid creadentials" });

    // never tell the client which one is incorrect  because maliciour user can find that email can be correct or not
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid creadentials" });

    generateToken(user._id, res);
    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      message: "User logged in successfully",
    });
  } catch (error) {
    console.log("error in login controller", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
export const logout = async (_, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ message: "User logged out successfully" });
};

// export const updateProfile = async (req, res) => {
//   try {
//     const profilePic = req.body;
//     if (!profilePic)
//       return res.status(400).json({ message: "profilepic required" });
//     const userId = req.user._id;
//     const uplioadResponse = await cloudinary.uploader.upload(profilePic);

//     const upadateUser = await User.findByIdAndUpdate(
//       userId,
//       { profilePic: uplioadResponse.secure_url },
//       { new: true },
//     );

//     res.status(200).json({ message: "Profile updated successfully" });

//     // const user = await User.findById(userId);
//     // if (!user) return res.status(404).json({ message: "User not found" });
//     // user.profilePic = uplioadResponse.secure_url;
//     // await user.save();
//     // res.status(200).json({ message: "Profile updated successfully" });
//   } catch (error) {
//     console.log("error in updateProfile controller", error);
//     res
//       .status(500)
//       .json({ message: "Internal Server Error", error: error.message });
//   }
// };



export const updateProfile = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const uploadResponse = await cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${file.buffer.toString("base64")}`
    );

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    console.log("error in updateProfile controller", error);
    res.status(500).json({ message: "Server error" });
  }
};
