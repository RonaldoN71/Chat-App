import cloudinary from 'cloudinary';
import User from '../models/user.model.js';
import Message from '../models/message.model.js';
import {getReceiverSocketId,io} from '../lib/socket.js'
import groupMessage from '../models/groupMessage.model.js'
import group from "../models/group.model.js";

export const getUserForSidebar = async (req,res) =>{
    try{
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-password");

        res.status(200).json(filteredUsers);
    }catch(err){
        console.log("Error in getUserForSidebar",err);
        res.status(500).json({message:"Internal server error"});
    }
}

export const getMessages = async(req,res)=>{
    try{
        const {id: usertoChatId} = req.params;
        const myId = req.user._id;
        const message = await Message.find({
            $or: [
                {senderId: myId,receiverId: usertoChatId},
                {senderId: usertoChatId, receiverId: myId},
            ]
        })
        res.status(200).json(message);
    }catch(err){
        console.log("Error in getMessage controller",err);
        res.status(500).json({message:"Internal server error"});
    }
}

export const getGroupMessage = async(req,res)=>{
    try{
        const {groupId} = req.params;
        const messages = await groupMessage.find({groupId}).populate("senderId","fullName profilePic");
        res.json(messages);
    }catch(err){
        res.status(500).json({error: "Error fetching group messages"});
    }
}

export const sendMessage = async(req,res)=>{
    try{
        const {image,text} = req.body;
        const {id:receiverId} = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
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
        // socket.io section 
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }
         res.status(200).json(newMessage);


    }catch(err){
        console.log("Error in sendMessages",err);
        res.status(500).json({message:"Internal server error"});
    }
}

export const sendGroupMessage = async (req,res)=>{
    try{
        const {groupId} = req.params;
        const {text,image} = req.body;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
        }
        const newGroupMessage = new groupMessage({
            groupId,
            senderId,
            text,
            image: imageUrl,
        })
        //TODO : socked.io
        await newGroupMessage.save();
        res.status(201).json(newGroupMessage);
    }catch(err){
        console.log("Error in sendGroupMessage",err);
        res.status(500).json({message:"Internal Server error"});
    }
}



export const createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;

    if (!name || !members?.length) {
      return res.status(400).json({ message: "Group name and members are required" });
    }

    const newGroup = new group({ name, members });
    await newGroup.save();

    res.status(201).json(newGroup);
  } catch (error) {
    res.status(500).json({ message: "Error creating group", error: error.message });
  }
};

export const getGroups = async (req, res) => {
  try {
    const groups = await group.find()
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch groups", error: error.message });
  }
};

