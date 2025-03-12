import mongoose from 'mongoose';
const MONGO_URI = process.env.MONGO_URI;

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(`${MONGO_URI}`);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('Error connecting to MongoDB', err);
    process.exit(1); // หยุดโปรแกรมเมื่อการเชื่อมต่อไม่สำเร็จ
  }
};

export default connectDB;
