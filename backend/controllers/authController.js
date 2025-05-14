import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { generateId } from "../utils/generateID.js";

export const registerUser = async (req, res) => {
    try {
      console.log("Register route hit");
      const { name, email, password, role } = req.body;
  
      if (!name || !email || !password || !role) {
        return res.status(400).json({
          message: "Please fill in all fields",
          success: false,
        });
      }
  
      // prevent registering admin
      if (role === "admin") {
        return res.status(403).json({
          success: false,
          message: "Admin registration is not allowed",
        });
      }
  
      // check for existing user
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }
  
      //hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed password:", hashedPassword);
        //generate userId
      let userId =  await generateId(role);

      console.log("Generated userId:", userId);
      //create new user
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role,
        userId,
      });
  
      await newUser.save();
  
      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          userId: newUser.userId,
        },
      });
    } catch (error) {
      console.error("Registration Error:", error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
        error: error.message,
      });
    }
  };
  
  

  export const loginUser = async (req, res) => {
    try {
      console.log("Login route hit");
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({
          message: "Please fill in all fields",
          success: false,
        });
      }
  
      //admin Login
      if (email === process.env.ADMIN_EMAIL) {
        if (password !== process.env.ADMIN_PASSWORD) {
          return res.status(400).json({
            success: false,
            message: "Invalid admin credentials",
          });
        }
  
        // fake admin payload 
        const adminPayload = {
          id: "ADMIN01",
          role: "admin",
        };
  
        const token = generateToken({ id:adminPayload.id, role: adminPayload.role });
  
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 24 * 60 * 60 * 1000,
        });
  
        return res.status(200).json({
          success: true,
          message: "Admin login successful",
          token,
          user: {
            email: process.env.ADMIN_EMAIL,
            role: "admin",
          },
        });
      }
  
      // user login
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid email or password",
        });
      }
  
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          message: "Invalid password",
        });
      }
  
      const token = generateToken({ id: user._id ,userId:user.userId ,role: user.role });
  
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });
  
      res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          userId: user.userId,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  };
  