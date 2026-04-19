import express from "express";
import {
  deleteMessage,
  getAllConversations,
  getConversation,
  markAsRead,
  sendMessage,
} from "../controller/chatcontroller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/message", authMiddleware, upload.single("file"), sendMessage);
router.get("/conversations", authMiddleware, getAllConversations);
router.get("/conversation/:id", authMiddleware, getConversation);
router.patch("/message/:id/read", authMiddleware, markAsRead);
router.delete("/message/:id", authMiddleware, deleteMessage);

export default router;
