import { Gym, GymDocument } from '../models/gym.model';
import { BaseService } from './base.service';
import { Types } from 'mongoose';
import { User } from '../models/user.model';

class GymService extends BaseService<GymDocument> {
  constructor() {
    super(Gym); // ส่ง Model ไปยัง BaseService
  }

  async searchGyms(
    query: string = '',
    province?: string,
    district?: string,
    facility?: string,
    page: number = 1,
    limit: number = 10,
    sort?: string
  ): Promise<{ gyms: GymDocument[], total: number }> {
    const filter: any = {};
  
    // Add search query condition
    if (query && query.trim().length > 0) {
      const searchRegex = new RegExp(query, 'i');
      filter.$or = [
        { gym_name: searchRegex },
        { description: searchRegex }
      ];
    }
  
    // Add province filter
    if (province) {
      filter['address.province'] = new RegExp(province, 'i');
    }
  
    // Add district filter
    if (district) {
      filter['address.district'] = new RegExp(district, 'i');
    }
  
    // Add facility filter
    if (facility) {
      filter['facilities.facility_name'] = new RegExp(facility, 'i');
    }
  
    // Define sort options
    let sortOption: any = { createdAt: -1 }; // Default sort by creation date DESC
    if (sort === 'name') {
      sortOption = { gym_name: 1 }; // Sort by name ASC
    } else if (sort === 'latest') {
      sortOption = { createdAt: -1 }; // Sort by creation date DESC
    }
  
    // Calculate pagination
    const skip = (page - 1) * limit;
  
    // Execute query
    const gyms = await Gym.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();
  
    // Get total count for pagination
    const total = await Gym.countDocuments(filter);
  
    return { gyms, total };
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

  async checkGymNameExists(gymName: string): Promise<boolean> {
    try {
      // Use RegExp for case-insensitive search
      const regex = new RegExp(`^${gymName}$`, 'i');
      const gym = await Gym.findOne({ gym_name: regex });
      return !!gym; // return true if gym found, false if not
    } catch (error) {
      console.error('Error checking gym name existence:', error);
      throw error;
    }
  }
}

export default new GymService();