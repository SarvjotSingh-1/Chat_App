import express from "express";
// import messageController from '../controllers/message.controller.js'

const router = express.Router();
router.get("/send", (req, res) => {
  res.send("message end point ");
});
export default router;
