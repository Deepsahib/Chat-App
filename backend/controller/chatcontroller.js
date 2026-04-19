import Message from "../models/Message.js";
import Conversation from "../models/conversation.js";
import uploadFileToCloudinary from "../config/cloudinaryImageUpload.js";

export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, content, messageStatus } = req.body;
    const file = req.file;

    const participants = [senderId, receiverId].sort();

    // find or create conversation
    let conversation = await Conversation.findOne({ participants });

    if (!conversation) {
      conversation = new Conversation({ participants });
      await conversation.save();
    }

    let imageVideoUrl = null;
    let contentType = "text"; // default from schema

    // 📁 file handling
    if (file) {
      const uploadFile = await uploadFileToCloudinary(file.path);
      imageVideoUrl = uploadFile.secure_url;

      if (file.mimetype.startsWith("image")) {
        contentType = "image";
      } else if (file.mimetype.startsWith("video")) {
        contentType = "video";
      }
    }

    // 📝 text handling (only if NO file)
    if (!file && content && content.trim().length > 0) {
      contentType = "text";
    }

    // ❌ prevent empty message
    if (!file && (!content || content.trim().length === 0)) {
      return res.status(400).json({
        success: false,
        message: "Message cannot be empty",
      });
    }

    // ✅ create message with schema values
    const message = new Message({
      conversationId: conversation._id,
      sender: senderId,
      receiver: receiverId,
      content: content?.trim() || "",   // safe value
      imageVideoUrl: imageVideoUrl,     // null if no file
      contentType: contentType,
      messageStatus: messageStatus || "sent", // default fallback
    });

    await message.save();

    // update last message (optional but useful)
    conversation.lastMessage = message._id;
    await conversation.save();

    res.status(200).json({
      success: true,
      message,
    });

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const getAllConversations = async (req, res) => {
  try {
    const userId = req.user;

    const conversations = await Conversation.find({
      participants: { $in: [userId] },
    })
      .populate({
        path: "participants",
        select: "username profilePicture isOnline lastSeen",
      })
      .populate({
        path: "lastMessage",
        select: "content imageVideoUrl contentType createdAt sender",
      })
      .sort({ updatedAt: -1 }) // latest conversation first
      .lean();

    res.status(200).json({
      success: true,
      conversations,
    });

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getConversation=async(req,res)=>{
  const conversationId=req.params.id;
  const userId=req.user;
  try {
    if(!conversationId){
      return res.status(400).json({
        success:false,
        message:"Conversation ID is required"
      })
    }
    const messages=await Message.find({conversationId}).sort({createdAt:1}).lean();
    res.status(200).json({
      success:true,
      messages
    })
    await Message.updateMany({conversationId,receiver:userId},{$set:{messageStatus:"read"}})
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:"Server error"
    })
  }
}

export const markAsRead=async(req,res)=>{
  const messageId=req.params.id;
  const userId=req.user;
    try {
      const message = await Message.findOne({ _id: messageId, receiver: userId });
      if (!message) {
        return res.status(404).json({
          success: false,
          message: "Message not found"
        });
      }

      await Message.updateOne({ _id: messageId }, { $set: { messageStatus: "read" } });
      res.status(200).json({
        success:true,
        message:"Message marked as read"
      })
    } catch (error) {
      return res.status(500).json({
        success:false,
        message:"Server error"
      })
    }
}

export const deleteMessage = async (req, res) => {
  const messageId = req.params.id;
  const userId = req.user; // ensure this is user._id

  try {
    // correct query method
    const message = await Message.findOne({
      _id: messageId,
      sender: userId
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found or you are not the sender"
      });
    }

    await Message.deleteOne({ _id: messageId });

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};