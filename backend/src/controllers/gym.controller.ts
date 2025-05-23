import { Request, Response } from 'express';
import path from 'path';
import GymService from '../services/gym.service';

// สร้างโรงยิมใหม่
export const createGymController = async (req: Request, res: Response) => {
  try {
    // แปลง address และ contact จาก JSON string เป็น object (ถ้าข้อมูลเป็น string)
    if (typeof req.body.address === 'string') {
      req.body.address = JSON.parse(req.body.address);
    }
    
    if (typeof req.body.contact === 'string') {
      req.body.contact = JSON.parse(req.body.contact);
    }
    
    console.log("address after parsing:", req.body.address);
    console.log("contact after parsing:", req.body.contact);
    console.log("Full body data:", req.body);
    
    // ส่งข้อมูลที่แปลงแล้วไปยัง service
    const gym = await GymService.add(req.body);

    res.status(201).json({ success: true, data: gym });
  } catch (err) {
    console.error('Error creating gym:', err);
    res.status(500).json({ message: 'Error creating gym', error: err });
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

export const getTrainersByGymIdController = async (req: Request, res: Response) => {
  try {
    const trainers = await GymService.getTrainersByGymId(req.params.id);
    res.status(200).json({
      success: true,
      count: trainers.length,
      data: trainers
    });
  } catch (err) {
    console.error('Error fetching trainers:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching trainers', 
      error: err 
    });
  }
};

// Get boxers by gym ID
export const getBoxersByGymIdController = async (req: Request, res: Response) => {
  try {
    const boxers = await GymService.getBoxersByGymId(req.params.id);
    res.status(200).json({
      success: true,
      count: boxers.length,
      data: boxers
    });
  } catch (err) {
    console.error('Error fetching boxers:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching boxers', 
      error: err 
    });
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

export const searchGymsController = async (req: Request, res: Response) => {
  try {
    // Extract query parameters
    const { 
      query = '', 
      province, 
      district, 
      facility,
      page = '1',
      limit = '10',
      sort
    } = req.query;
    
    // Parse numeric parameters
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    
    // Search for gyms with filters
    const { gyms, total } = await GymService.searchGyms(
      query as string,
      province as string | undefined,
      district as string | undefined,
      facility as string | undefined,
      pageNum,
      limitNum,
      sort as string | undefined
    );
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / limitNum);
    
    res.status(200).json({
      success: true,
      count: gyms.length,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      data: gyms
    });
  } catch (err) {
    console.error('Error searching gyms:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error searching gyms', 
      error: err 
    });
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

export const checkGymNameController = async (req: Request, res: Response) => {
  try {
    const { gymName } = req.params;
    
    if (!gymName) {
      res.status(400).json({ 
        success: false, 
        message: 'Gym name is required' 
      });
      return;
    }
    
    const exists = await GymService.checkGymNameExists(gymName);
    
    // Send result back
    res.status(200).json({
      success: true,
      exists: exists,
      message: exists ? 'Gym name already exists' : 'Gym name is available'
    });
  } catch (err) {
    console.error('Error checking gym name:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error checking gym name', 
      error: err 
    });
  }
};