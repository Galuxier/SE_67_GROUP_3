import { Request, Response } from 'express';
import PlaceService from '../services/place.service';

export const createPlaceController = async (req: Request, res: Response) => {
  try {
    const newPlace = await PlaceService.add(req.body);
    res.status(201).json(newPlace);
  } catch (err) {
    res.status(400).json({ message: 'Error creating Place', error: err });
  }
};

export const getPlacesController = async (req: Request, res: Response) => {
  try {
    const Places = await PlaceService.getAll();
    res.status(200).json(Places);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching Places', error: err });
  }
};

export const getPlaceByIdController = async (req: Request, res: Response) => {
  try {
    const Place = await PlaceService.getById(req.params.id);
    if (!Place) {
      res.status(404).json({ message: 'Place not found' });
      return;
    }
    res.status(200).json(Place);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching Place', error: err });
  }
};

export const updatePlaceController = async (req: Request, res: Response) => {
  try {
    const updatedPlace = await PlaceService.update(req.params.id, req.body);
    res.status(200).json(updatedPlace);
  } catch (err) {
    res.status(500).json({ message: 'Error updating Place', error: err });
  }
};

export const deletePlaceController = async (req: Request, res: Response) => {
  try {
    const deletedPlace = await PlaceService.delete(req.params.id);
    res.status(200).json(deletedPlace);
  } catch (err) {
    res.status(500).json({ message: 'Error deleting Place', error: err });
  }
};