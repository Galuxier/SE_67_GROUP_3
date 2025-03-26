import { Gym, GymDocument } from '../models/gym.model';
import { BaseService } from './base.service';
import { Types } from 'mongoose';
import { User } from '../models/user.model';

class GymService extends BaseService<GymDocument> {
  constructor() {
    super(Gym); // ส่ง Model ไปยัง BaseService
  }

  // สร้างโรงยิมใหม่
  async createGym(gymData: any, filePaths: string[]) {
    console.log(gymData);
    console.log(filePaths);

    try {
      if (typeof gymData.address === 'string') {
        gymData.address = JSON.parse(gymData.address);
      }

      if (typeof gymData.contact === 'string') {
        gymData.contact = JSON.parse(gymData.contact);
      }

      const gym = new Gym({
        ...gymData,
        address: gymData.address, // ใส่ address อย่างชัดเจน
        gym_image_url: filePaths, // เก็บ path ของไฟล์ที่อัปโหลด
      });

      console.log(gym);
      await gym.save();
      return gym;
    } catch (error) {
      console.error("Failed to create gym:", error);
      throw new Error("Failed to create gym");
    }
  }

  async getTrainersByGymId(gymId: string): Promise<any[]> {
    try {
      // Find all users with role 'trainer' who are associated with this gym
      const trainers = await User.find({
        role: { $in: ['trainer'] },
        gym_id: new Types.ObjectId(gymId)
      });
      
      return trainers;
    } catch (error) {
      console.error("Error fetching trainers by gym ID:", error);
      throw error;
    }
  }
  
  async getBoxersByGymId(gymId: string): Promise<any[]> {
    try {
      // Find all users with role 'boxer' who are associated with this gym
      const boxers = await User.find({
        role: { $in: ['boxer'] },
        gym_id: new Types.ObjectId(gymId)
      });
      
      return boxers;
    } catch (error) {
      console.error("Error fetching boxers by gym ID:", error);
      throw error;
    }
  }
}

export default new GymService();