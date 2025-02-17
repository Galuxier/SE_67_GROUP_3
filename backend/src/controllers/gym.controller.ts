import { Request, Response } from 'express';
import GymService from '../services/gym.service';

// สร้างโรงยิมใหม่
export const createGymController = async (req: Request, res: Response) => {
  try {
    const newGym = await GymService.add(req.body);
    res.status(201).json(newGym);
  } catch (err) {
    res.status(400).json({ message: 'Error creating gym', error: err });
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