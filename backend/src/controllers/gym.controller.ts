import { Request, Response } from 'express';
import GymService from '../services/gym.service';

// สร้างโรงยิมใหม่
export const createGymController = async (req: Request, res: Response) => {
  try {
    const { owner_id, gym_name, description, contact, address } = req.body;

    // ตรวจสอบและระบุประเภทของ req.files
    const files = req.files as Express.Multer.File[] | undefined;

    // ดึง path ของไฟล์ที่อัปโหลด
    const filePaths = files?.map((file) => file.path) || [];
    
    // สร้าง Gym โดยใช้ GymService
    const gym = await GymService.createGym(
      { owner_id, gym_name, description, contact, address },
      filePaths
    );

    res.status(201).json({ success: true, data: gym });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching gyms', error: err });
  }
};

// ดึงข้อมูลโรงยิมทั้งหมด
export const getGymsController = async (req: Request, res: Response) => {
  try {
    const gyms = await GymService.getAll();
    res.status(200).json(gyms);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching gyms', error: err });
  }
};

// ดึงข้อมูลโรงยิมจาก _id
export const getGymByIdController = async (req: Request, res: Response) => {
  try {
    const gym = await GymService.getById(req.params.id);
    if (!gym) {
      res.status(404).json({ message: 'Gym not found' });
      return;
    }
    res.status(200).json(gym);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching gym', error: err });
  }
};

// export const updateGymController = async (req: Request, res: Response) => {
//   try {
//     const { owner_id, gym_name, description, contact, address } = req.body;

//     // ตรวจสอบและระบุประเภทของ req.files
//     const files = req.files as Express.Multer.File[] | undefined;

//     // ดึง path ของไฟล์ที่อัปโหลด
//     const filePaths = files?.map((file) => file.path) || [];

//     // อัปเดตข้อมูลโรงยิมโดยใช้ GymService
//     const updatedGym = await GymService.updateGym(
//       req.params.id, // gymId
//       { owner_id, gym_name, description, contact, address }, // ข้อมูลทั่วไป
//       filePaths // path ของไฟล์ที่อัปโหลด
//     );

//     res.status(200).json({ success: true, data: updatedGym });
//   } catch (err) {
//     res.status(500).json({ message: "Error updating gym", error: err });
//   }
// };

// อัปเดตข้อมูลโรงยิม 
export const updateGymController = async (req: Request, res: Response) => {
  try {
    const updatedGym = await GymService.update(req.params.id, req.body);
    res.status(200).json(updatedGym);
  } catch (err) {
    res.status(500).json({ message: 'Error updating gym', error: err });
  }
};

// ลบโรงยิม
export const deleteGymController = async (req: Request, res: Response) => {
  try {
    const deletedGym = await GymService.delete(req.params.id);
    res.status(200).json(deletedGym);
  } catch (err) {
    res.status(500).json({ message: 'Error deleting gym', error: err });
  }
};