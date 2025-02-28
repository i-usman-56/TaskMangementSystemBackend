import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { username, password, role, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Password Does't  Match" });
    }
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error); // Log the error
    res.status(500).json({ error: "Error creating user" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Login attempt:", { username, password }); // Log the login attempt

    const user = await User.findOne({ username });
    console.log("User found:", user); // Log the found user

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Password valid:", isPasswordValid); // Log password validation result

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );
    res.status(200).json({ token, userID: user._id, role: user.role });
  } catch (error) {
    console.error("Login error:", error); // Log any errors
    res.status(500).json({ error: "Login failed" });
  }
};
// Get user data by ID (using the user ID from the token)
export const getUserDataById = async (req, res) => {
  try {
    const { id } = req.user; // Extract the user ID from the token

    const user = await User.findById(id).select("-password"); // Exclude password from returned data

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user); // Send back user data
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Error fetching user data" });
  }
};
export const getAllUser = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude password from returned data
    res.status(200).json(users); // Send back all users data
  } catch (error) {
    console.error("Error fetching all users data:", error);
    res.status(500).json({ error: "Error fetching all users data" });
  }
};
