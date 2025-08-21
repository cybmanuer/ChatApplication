import express from 'express'

const router = express.Router();

// importing the controllers 
import { signup,logout,login,updateProfile,checkAuth,deleteUser,updateDisappearing} from '../controllers/auth.controller.js';

import {protectRoute} from "../middleware/auth.middleware.js"

router.post("/signup",signup)

router.post("/login",login)

router.post("/logout",logout)

//protectRoute -> middleware that validates the user (loged in & jwt token ) and only allowed verifed user to  update
router.put("/update-profile", protectRoute, updateProfile);

router.get("/check" , protectRoute , checkAuth); // used to verify if the user is loged in or not 

router.delete("/delete-account", protectRoute, deleteUser) //to delete the user account

// router.delete("/disappear-msg",protectRoute , deleteOldMessages) // to delete old messages
router.put("/disappear-msg",protectRoute , updateDisappearing) // to delete old messages




export default router; // exporting the router(paths) to main page(index.js)
 