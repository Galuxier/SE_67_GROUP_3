import { Request, Response } from 'express';
import TeachHistoryService from '../services/teachHistory.service';

export const createTeachHistoryController = async (req: Request, res: Response) => {
  try {
    const newTeachHistory = await TeachHistoryService.add(req.body);
    res.status(201).json(newTeachHistory);
  } catch (err) {
    res.status(400).json({ message: 'Error creating teaching history', error: err });
  }
};

export const getTeachHistoriesController = async (req: Request, res: Response) => {
  try {
    const teachHistories = await TeachHistoryService.getAll();
    res.status(200).json(teachHistories);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching teaching histories', error: err });
  }
};

export const getTeachHistoryByIdController = async (req: Request, res: Response) => {
  try {
    const teachHistory = await TeachHistoryService.getById(req.params.id);
    if (!teachHistory) {
      res.status(404).json({ message: 'Teaching history not found' });
      return;
    }
    res.status(200).json(teachHistory);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching teaching history', error: err });
  }
};

export const updateTeachHistoryController = async (req: Request, res: Response) => {
  try {
    const updatedTeachHistory = await TeachHistoryService.update(req.params.id, req.body);
    res.status(200).json(updatedTeachHistory);
  } catch (err) {
    res.status(500).json({ message: 'Error updating teaching history', error: err });
  }
};

export const deleteTeachHistoryController = async (req: Request, res: Response) => {
  try {
    const deletedTeachHistory = await TeachHistoryService.delete(req.params.id);
    res.status(200).json(deletedTeachHistory);
  } catch (err) {
    res.status(500).json({ message: 'Error deleting teaching history', error: err });
  }
};