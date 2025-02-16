import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect('mongodb+srv://test:test@cluster0.k53gs.mongodb.net/MuatThai_SE?retryWrites=true&w=majority&appName=Cluster0');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('Error connecting to MongoDB', err);
    process.exit(1); // หยุดโปรแกรมเมื่อการเชื่อมต่อไม่สำเร็จ
  }
};

export default connectDB;
