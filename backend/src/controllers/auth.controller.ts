import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";
import { log } from "console";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";

// สมัครสมาชิก
export const register = async (req: Request, res: Response) => {
  try {
    const user = await registerUser(req.body); // ส่ง req.body ไปยัง service
    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      if (err.message === "Email already exists" || err.message === "Username already exists") {
        res.status(400).json({ message: err.message }); // ส่งข้อความผิดพลาดกลับไปยัง Frontend
      } else {
        res.status(500).json({ message: "Internal server error" }); // ข้อผิดพลาดอื่น ๆ
      }
    } else {
      res.status(500).json({ message: "An unknown error occurred" }); // ข้อผิดพลาดที่ไม่รู้จัก
    }
  }
};

// เข้าสู่ระบบ
export const login = async (req: Request, res: Response) => {
  try {
    const { token } = await loginUser(req.body); // ส่ง req.body ไปยัง service
    res.json({ token });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ message: err.message }); // ส่งข้อความผิดพลาดกลับไปยัง Frontend
    } else {
      res.status(500).json({ message: "An unknown error occurred" }); // ข้อผิดพลาดที่ไม่รู้จัก
    }
  }
};

export const verifyPasswordController = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      });
      return ;
    }

    // Find user by username
    const user = await User.findOne({ 
      username: { $regex: new RegExp(`^${username}$`, 'i') } 
    });

    if (!user) {
      res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
      return ;
    }

    // Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ 
        success: false, 
        message: 'Incorrect password' 
      });
      return ;
    }

    // Password is correct
    res.status(200).json({
      success: true,
      message: 'Password verification successful',
      user_id: user._id
    });
  } catch (error) {
    console.error('Error verifying password:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error verifying password', 
      error: error 
    });
  }
};