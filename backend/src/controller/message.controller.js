import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllContacts = async (req, res) => {
  try {
    const loggedinUserId = req.user._id;
    const filteredUser = await User.find({
      _id: { $ne: loggedinUserId },
    }).select("-password");
    res.status(200).json(filteredUser);
  } catch (error) {
    console.log("error in getAllContacts controller", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;

    const messages = await Message.find({
      $or: [
        // find all the messages between me and user
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("error in getMessagesByUserId controller", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // image upload to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();
    // todo send message innreal time if user is online soket.io
    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.log("error in sendMessage controller", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getchatParterner = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    // find all messages where logged in user either is sender or receiverId
    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });
    const chatPartners = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUserId
            ? msg.receiverId.toString()
            : msg.senderId.toString(),
        ),
      ),
    ];

    const chatParteners = await User.find({
      _id: { $in: chatPartners },
    }).select("-password");
    res.status(200).json(chatParteners);
  } catch (error) {
    console.log("error in getchatParterner controller", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
