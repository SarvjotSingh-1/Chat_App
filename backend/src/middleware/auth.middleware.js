import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token)
      return res
        .status(401)
        .json({ message: " Unauthorized - NO - Token proviede " });

    const decode = jwt.verify(token, ENV.JWT_SECRET);
    if (!decode)
      return res.status(401).json({ message: "Unauthorized - Invalid Token " });

    const user = await User.findById(decode.userId).select("-password"); // select everything except password
    if (!user)
      return res
        .status(401)
        .json({ message: "Unauthorized - User not found " });
    req.user = user; // add user to request to use this user to next function
    next();
  } catch (error) {
    console.log("error in protectRoute middleware", error);
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
};
