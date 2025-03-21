import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import userService from "./user.service";

// สมัครสมาชิก
export const registerUser = async (userData: {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}) => {
  const { username, email, password, first_name, last_name } = userData;
  console.log(username);
  
  const existingUserByUsername = await User.findOne({ 
    username: { $regex: new RegExp(`^${username}$`, 'i') } 
  });
  if (existingUserByUsername) {
    throw new Error("Username already exists");
  }

  const existingUserByEmail = await User.findOne({ email });
  if (existingUserByEmail) {
    throw new Error("Email already exists");
  }
  console.log(userData);
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  // สร้างผู้ใช้ใหม่
  const user = new User({
    username: username,
    email: email,
    password: hashedPassword,
    first_name: first_name,
    last_name: last_name,
    role: ["member"], // กำหนด role เริ่มต้น
    status: "active"
  });
  
  await user.save();

  return user;
};

// เข้าสู่ระบบ
export const loginUser = async (credentials: { identifier: string; password: string }) => {
  const { identifier, password } = credentials;

  try {
    // ตรวจสอบว่ามีการส่ง identifier และ password มา
    if (!identifier || !password) {
      throw new Error("Email/username and password are required");
    }

    // ค้นหาผู้ใช้ในฐานข้อมูล
    const user = await User.findOne({
      $or: [
        { email: identifier }, 
        { username: { $regex: new RegExp(`^${identifier}$`, 'i') }}
      ],
    });

    // ตรวจสอบว่าพบผู้ใช้หรือไม่
    if (!user) {
      throw new Error("User not found");
    }

    // ตรวจสอบรหัสผ่าน
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid email/username or password");
    }

    // สร้าง token
    var payload = {
      username: user.username,
      _id: user._id,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name
    }
    const token = jwt.sign(payload, `${process.env.TOKEN_KEY}`, { expiresIn: "2h" });
    // ส่งคืน token และข้อมูลผู้ใช้
    return { token };
  } catch (error) {
    console.error("Login error:", error);

    // จัดการ error ต่าง ๆ
    if (error instanceof Error) {
      // หาก error เป็นประเภท Error (เช่น throw new Error)
      throw new Error(error.message);
    } else {
      // หาก error เป็นประเภทอื่น (เช่น error จากฐานข้อมูล)
      throw new Error("An unexpected error occurred during login");
    }
  }
};