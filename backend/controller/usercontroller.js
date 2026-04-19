import User from "../models/userschema.js";
import Conversation from "../models/conversation.js";

export const getAllUsers = async (req, res) => {
  const loggedInUser = req.user;

  try {
    const users = await User.find({
      _id: { $ne: loggedInUser }
    })
      .select("username profilePicture lastSeen isOnline about phoneNumber phoneSuffix")
      .lean();

    const usersWithConversation = await Promise.all(
      users.map(async (user) => {
        const conversation = await Conversation.findOne({
          participants: { $all: [loggedInUser, user._id] }
        })
          .populate({
            path: "lastMessage",
            select: "content createdAt sender receiver"
          })
          .lean();

        return {
          ...user,
          conversation: conversation || null
        };
      })
    );

    res.status(200).json(usersWithConversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};