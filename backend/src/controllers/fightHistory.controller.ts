import { Request, Response } from 'express';
import FightHistoryService from '../services/fightHistory.service';
import { Types } from 'mongoose';

// สร้างประวัติการต่อสู้ใหม่
export const createFightHistoryController = async (req: Request, res: Response) => {
  try {
    const newFightHistory = await FightHistoryService.add(req.body);
    res.status(201).json(newFightHistory);
  } catch (err) {
    res.status(400).json({ message: 'Error creating fight history', error: err });
  }
};

// ดึงข้อมูลประวัติการต่อสู้ทั้งหมด
export const getFightHistoriesController = async (req: Request, res: Response) => {
  try {
    const fightHistories = await FightHistoryService.getAll();
    res.status(200).json(fightHistories);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching fight histories', error: err });
  }
};

// ดึงข้อมูลประวัติการต่อสู้จาก _id
export const getFightHistoryByIdController = async (req: Request, res: Response) => {
  try {
    const fightHistory = await FightHistoryService.getById(req.params.id);
    if (!fightHistory) {
      res.status(404).json({ message: 'Fight history not found' });
      return;
    }
    res.status(200).json(fightHistory);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching fight history', error: err });
  }
};

// อัปเดตข้อมูลประวัติการต่อสู้
export const updateFightHistoryController = async (req: Request, res: Response) => {
  try {
    const updatedFightHistory = await FightHistoryService.update(req.params.id, req.body);
    res.status(200).json(updatedFightHistory);
  } catch (err) {
    res.status(500).json({ message: 'Error updating fight history', error: err });
  }
};

// ลบประวัติการต่อสู้
export const deleteFightHistoryController = async (req: Request, res: Response) => {
  try {
    const deletedFightHistory = await FightHistoryService.delete(req.params.id);
    res.status(200).json(deletedFightHistory);
  } catch (err) {
    res.status(500).json({ message: 'Error deleting fight history', error: err });
  }
};

export const getFightHistoriesByUserIdController = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    
    // Validate userId
    if (!Types.ObjectId.isValid(userId)) {
      res.status(400).json({ 
        success: false, 
        message: 'Invalid user ID format' 
      });
      return;
    }
    
    // Get fight histories for the specified user
    const fightHistories = await FightHistoryService.getFightHistoriesByUserId(userId);
    
    res.status(200).json({
      success: true,
      count: fightHistories.length,
      data: fightHistories
    });
  } catch (err) {
    console.error('Error fetching user fight histories:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching fight histories', 
      error: err 
    });
  }
};