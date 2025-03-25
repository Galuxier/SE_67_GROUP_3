import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";
import { log } from "console";

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