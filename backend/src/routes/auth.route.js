import express from "express";
// import authController from '../controllers/auth.controller.js'
import { signup , login , logout } from "../controller/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;
