import express from 'express'
import {getUserForSidebar,getMessages,sendMessage,sendGroupMessage,getGroupMessage,createGroup,getGroups} from '../controllers/message.controller.js';
const router = express.Router();
import {protectRoute} from '../middleware/auth.middleware.js'

router.get("/users",protectRoute,getUserForSidebar)
router.get("/:id",protectRoute,getMessages);
router.post("/send/:id",protectRoute,sendMessage);

// group-message
router.post("/Gsend/:groupId",protectRoute,sendGroupMessage);
router.get("/Gget/:groupId",protectRoute,getGroupMessage)
router.post("/group/create",protectRoute,createGroup);
router.get("/group/get",protectRoute,getGroups);
export default router;