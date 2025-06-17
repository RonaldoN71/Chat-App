import express from "express"
import {protectRoute} from '../middleware/auth.middleware.js'
import { upload } from '../middleware/multer.middleware.js';
const router = express.Router();
import {login,logout,signup,updateProfile,checkAuth} from "../controllers/auth.controller.js";

router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)
router.post("/update-profile",protectRoute,upload.single('profilePic'),updateProfile)
router.get("/check",protectRoute,checkAuth)
export default router;