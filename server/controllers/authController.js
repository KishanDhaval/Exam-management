import jwt from "jsonwebtoken";
import validator from "validator"
import bcrypt from "bcrypt"
import User from "../models/User.js";

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

export const registerController = async (req, res) => {
  const { name, email, password , role } = req.body;

  try {
    if (!name) throw Error("Name is required.");
    if (!email) throw Error("Email is required.");
    if (!password) throw Error("Password is required.");
    if (!validator.isEmail(email)) throw Error("Invalid email format.");

    const existingUser = await User.findOne({ email });
    if (existingUser) throw Error("An account with this email already exists.");

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);  

    const user = await User.create({
      name,
      email,
      password: hash,
      role
    });

    // Generate a token for the new user
    const token = createToken(user._id);

    // Select the user excluding the password field and populate necessary fields
    const userWithoutPassword = await User.findById(user._id).select(
      "-password"
    );

    // Send response with user info and token
    res.status(200).json({
      success: true,
      message: "Welcome",
      user: {
        ...userWithoutPassword.toObject(),
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    
    if (!email) throw Error("Email is required.");
    if (!password) throw Error("Password is required.");
    if (!validator.isEmail(email)) throw Error("Invalid email format.");
    
    const user = await User.findOne({ email });
    
    if (!user) throw Error("Invalid login credentials");
    
    const match = await bcrypt.compare(password, user.password);
    
    if (!match) {
      throw Error("Invalid login credentials");
    }
    
    // Select the user excluding the password field and add the token
    const userWithoutPassword = await User.findById(user._id)
    .select("-password")
    
    const token = createToken(user._id);

    res.status(200).json({
      success: true,
      message: "Welcome back!!!",
      user: {
        ...userWithoutPassword.toObject(),
        token,
      },
    });
  } catch (error) {    
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  const { userId } = req.params; // Get userId from URL params

  try {
    // Find user by userId and exclude password field from the result
    const user = await User.findById(userId)
      .select("-password")
      .populate("challengeSubmissions")
      .populate("componentSubmissions")
      .populate("winning")
      .populate("savedSubmissions");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user, // Return the user data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve user",
      error: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  const { name,phoneNumber } = req.body;
  const userId = req.user._id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, phoneNumber },
      { new: true }
    )
      .select("-password")

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const token = createToken(updatedUser._id);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        ...updatedUser.toObject(),
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("challengeSubmissions")
      .populate("componentSubmissions")
      .populate("winning")
      .populate("savedSubmissions");

    if (!users) {
      return res.status(404).json({
        success: false,
        message: "User not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Success",
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve saved submissions",
      error: error.message,
    });
  }
};

