import express from "express";
// import messageController from '../controllers/message.controller.js'
import {
  getAllContacts,
  getchatParterner,
  getMessagesByUserId,
  sendMessage,
} from "../controller/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
const router = express.Router();
router.use(arcjetProtection, protectRoute);
// use middleware
router.get("/contacts", getAllContacts);
router.get("/chats", getchatParterner);
router.get("/:id", getMessagesByUserId);

router.post("/send/:id", sendMessage);
export default router;
