import express from "express";
// import authController from '../controllers/auth.controller.js'
import {
  signup,
  login,
  logout,
  updateProfile,
} from "../controller/auth.controller.js";

import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
import { upload } from "../middleware/multer.middleware.js";



const router = express.Router();

router.use(arcjetProtection); // instead of arcjetProtection  again and again we use middleware
// router.get("/test", arcjetProtection, (req, res) => {
//   res.status(200).json({ message: "test route" });
// });
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", protectRoute, upload.single("profilePic"), updateProfile);

router.get("/check", protectRoute, (req, res) =>
  res.status(200).json(req.user),
);

export default router;
