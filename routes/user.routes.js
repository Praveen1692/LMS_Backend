import { Router } from "express";
import { forgotPassword, login, logout, profile, register, resetPassword } from "../controllers/user.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";
const router = Router(); // creating an instance of the express Router

router.post("/register",upload.single("avatar"), register); //   registering a new user to our database
router.post("/login", login); //    this route is for logging in users to the application

router.get("/logout", logout); //   log out a user by destroying their session and redirect them to home page
router.get('/me',isLoggedIn,profile); //    get information about the current logged-in user
router.post("/reset",forgotPassword);
router.post("/reset/:resetToken",resetPassword);


export default router;
