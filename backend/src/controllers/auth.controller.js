import User from '../models/user.model.js'
import {generateToken} from '../lib/utils.js'
import bcrypt from 'bcryptjs'
import cloudinary from '../lib/cloudinary.js';
export const signup = async (req,res)=>{
    try{
   const {fullName,email,password} = req.body;

        if(!fullName || !email || !password){
            return res.status(400).send("All fields are required");
        }

   if(password.length<6){
    return res.status(400).send("password much reached minimum length of 6");
   }
   const user = await User.findOne({email});
   if(user){
    return res.status(400).send("email already exist");
   }

   const salt = await bcrypt.genSalt(10)
   const hashedPassword = await bcrypt.hash(password,salt)

   const newUser = new User({
    fullName,
    email,
    password: hashedPassword
   })
   if(newUser){
    try{
    generateToken(newUser._id,res)
    await newUser.save();

    res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
    })
    console.log(newUser);
    }catch(err){
    console.error("Token/Save error:", err);
    res.status(500).send("Internal error");
    }
   }else{
    res.status(400).json({message: "Invalid user data"});
   }
}catch(err){
    console.log("Error in signup controller",err);
    res.status(500).send("Internal error");
}
}
export const login = async (req,res)=>{
   try{
   const {email,password} = req.body;
   if(!email || !password){
    res.status(400).send("All field required");
   }
   const user =  await User.findOne({email});
   if(!user) return res.status(400).send("invalid email");
   const isPassword = await bcrypt.compare(password,user.password);
   if(!isPassword) return res.status(400).send("incorrect password");

   generateToken(user._id,res);

   res.status(201).json({
     _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
   })
   }catch(err){
    console.log("Error in login controller",err);
    res.status(500).send("Internal error is there");
   }
}
export const logout = (req,res)=>{
   try{
    res.cookie("jwt","",{maxAge: 0});
    res.status(200).json({message:"Logout successfully"})
   }catch(err){
   console.log("Error in logout controller",err);
    res.status(500).send("Internal error");
   }
}

export const updateProfile = async (req,res)=>{
   try {
    const file = req.file;
    const userId = req.user._id;

    if (!file) {
      return res.status(400).json({ message: "Picture not found" });
    }

    // Convert file buffer to base64 string for cloudinary
    const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

    const uploadRespond = await cloudinary.uploader.upload(base64Image);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadRespond.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
    }catch(err){
        console.log("error in update profile",err);
        res.status(500).json({message:"Internal error"});
    }
}

export const checkAuth = async(req,res)=>{
    try{
        res.status(200).json(req.user);

    }catch(err){
        console.log("error in auth");
        res.status(500).json({message:"Internal error"});
    }
}