import { Gym, GymDocument } from '../models/gym.model';
import { BaseService } from './base.service';

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

  // อัปเดตโรงยิม
  // async updateGym(gymId: string, gymData: any, filePaths: string[]) {
  //   console.log(gymData);
  //   console.log(filePaths);

  //   try {
  //     if (typeof gymData.address === 'string') {
  //       gymData.address = JSON.parse(gymData.address);
  //     }

  //     if (typeof gymData.contact === 'string') {
  //       gymData.contact = JSON.parse(gymData.contact);
  //     }

  //     // อัปเดตข้อมูลทั่วไป
  //     const updatedGym = await Gym.findByIdAndUpdate(
  //       gymId,
  //       {
  //         ...gymData,
  //         address: gymData.address, // ใส่ address อย่างชัดเจน
  //         gym_image_url: filePaths, // เก็บ path ของไฟล์ที่อัปโหลด
  //       },
  //       { new: true } // ส่งคืนข้อมูลที่อัปเดต
  //     );

  //     if (!updatedGym) {
  //       throw new Error("Gym not found");
  //     }

  //     console.log(updatedGym);
  //     return updatedGym;
  //   } catch (error) {
  //     console.error("Failed to update gym:", error);
  //     throw new Error("Failed to update gym");
  //   }
  // }
}

export default new GymService();