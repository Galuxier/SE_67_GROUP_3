import { Request, Response } from 'express';
import RecommendService from '../services/recommend.service';

export const createRecommendController = async (req: Request, res: Response) => {
  try {
    const newRecommend = await RecommendService.add(req.body);
    res.status(201).json(newRecommend);
  } catch (err) {
    res.status(400).json({ message: 'Error creating recommendation', error: err });
  }
};

export const getRecommendsController = async (req: Request, res: Response) => {
  try {
    const recommends = await RecommendService.getAll();
    res.status(200).json(recommends);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching recommendations', error: err });
  }
};

export const getRecommendByIdController = async (req: Request, res: Response) => {
  try {
    const recommend = await RecommendService.getById(req.params.id);
    if (!recommend) {
      res.status(404).json({ message: 'Recommendation not found' });
      return;
    }
    res.status(200).json(recommend);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching recommendation', error: err });
  }
};

export const updateRecommendController = async (req: Request, res: Response) => {
  try {
    const updatedRecommend = await RecommendService.update(req.params.id, req.body);
    res.status(200).json(updatedRecommend);
  } catch (err) {
    res.status(500).json({ message: 'Error updating recommendation', error: err });
  }
};

export const deleteRecommendController = async (req: Request, res: Response) => {
  try {
    const deletedRecommend = await RecommendService.delete(req.params.id);
    res.status(200).json(deletedRecommend);
  } catch (err) {
    res.status(500).json({ message: 'Error deleting recommendation', error: err });
  }
};