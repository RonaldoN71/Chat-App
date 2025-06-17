import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
export const protectRoute = async (req,res,next)=>{
  try{
    const token = req.cookies.jwt;
    if(!token){
        return res.status(400).json({message:"Unauthorized-No token provided"});
    }
    const decode = jwt.verify(token,process.env.JWT_SECRET);
    if(!decode){
        return res.status(400).json({message:"Invalid token"});
    }
    const user = await User.findById(decode.userId).select("-password");
    req.user = user
    next();
  }catch(err){
    console.log("error in protected middleware",err);
    res.status(500).json({message: "Internal server error"});
  }
}