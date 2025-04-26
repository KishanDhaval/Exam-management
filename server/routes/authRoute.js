import express from "express";
import { registerController, loginController, updateProfile } from "../controllers/authController.js";
import { requireSignin } from "../middlewares/authMiddleware.js";

// router object
const router = express.Router();

// REGISTER || METHOD POST
router.post("/register", registerController);

// LOGIN || METHOD POST
router.post("/login", loginController);

router.put("/"  , requireSignin, updateProfile)

export default router;
