import mongoose from "mongoose";
const MessageSchema = new mongoose.Schema({
conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
content: { type: String},
imageVideoUrl: { type: String },
contentType: { type: String, enum: ["text", "image", "video"], default: "text" },
reactions: [
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    emoji: { type: String }
  }
],
messageStatus: { type: String, },
},{timestamps:true});
const Message = mongoose.model("Message", MessageSchema);
export default Message;