import express from "express";
// import authController from '../controllers/auth.controller.js'
import { signup } from "../controller/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.get("/login");
router.get("/logout");

export default router;
