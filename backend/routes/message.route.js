import express from 'express';

import {protectRoute} from '../middleware/auth.middleware.js';
import {getUsersForSidebar,getMessages,sendMessage} from '../controllers/message.controller.js';


const router = express.Router();

router.get("/users" , protectRoute , getUsersForSidebar);   //getUsersForSidebar -> logic is defined in the message controller
router.get("/:id", protectRoute , getMessages) //feteching the messages of the user with id

router.post("/send/:id",protectRoute,sendMessage);





export default router;
