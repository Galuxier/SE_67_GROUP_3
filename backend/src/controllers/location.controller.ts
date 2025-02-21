import { Request, Response } from 'express';
import LocationService from '../services/location.service';

export const createLocationController = async (req: Request, res: Response) => {
  try {
    const newLocation = await LocationService.add(req.body);
    res.status(201).json(newLocation);
  } catch (err) {
    res.status(400).json({ message: 'Error creating location', error: err });
  }
};

export const getLocationsController = async (req: Request, res: Response) => {
  try {
    const locations = await LocationService.getAll();
    res.status(200).json(locations);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching locations', error: err });
  }
};

export const getLocationByIdController = async (req: Request, res: Response) => {
  try {
    const location = await LocationService.getById(req.params.id);
    if (!location) {
      res.status(404).json({ message: 'Location not found' });
      return;
    }
    res.status(200).json(location);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching location', error: err });
  }
};

export const updateLocationController = async (req: Request, res: Response) => {
  try {
    const updatedLocation = await LocationService.update(req.params.id, req.body);
    res.status(200).json(updatedLocation);
  } catch (err) {
    res.status(500).json({ message: 'Error updating location', error: err });
  }
};

export const deleteLocationController = async (req: Request, res: Response) => {
  try {
    const deletedLocation = await LocationService.delete(req.params.id);
    res.status(200).json(deletedLocation);
  } catch (err) {
    res.status(500).json({ message: 'Error deleting location', error: err });
  }
};