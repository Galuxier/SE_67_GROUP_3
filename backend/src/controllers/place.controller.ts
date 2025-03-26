import { Request, Response } from 'express';
import PlaceService from '../services/place.service';
import { Types } from 'mongoose';

export const createPlaceController = async (req: Request, res: Response) => {
  try {
    
    req.body.address = JSON.parse(req.body.address);
    console.log(req.body);
    const newPlace = await PlaceService.add(req.body);
    
    
    res.status(201).json(newPlace);
  } catch (err) {
    console.log(err);
    
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
    const placeId = req.params.id;
    
    // Validate place ID
    if (!Types.ObjectId.isValid(placeId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid place ID format'
      });
      return;
    }
    
    const place = await PlaceService.getById(placeId);
    
    if (!place) {
      res.status(404).json({
        success: false,
        message: 'Place not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: place
    });
  } catch (err) {
    console.error('Error fetching place:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching place', 
      error: err 
    });
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

export const getPlacesByOwnerIdController = async (req: Request, res: Response) => {
  try {
    const ownerId = req.params.ownerId;
    
    // Validate owner ID
    if (!Types.ObjectId.isValid(ownerId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid owner ID format'
      });
      return;
    }
    
    const places = await PlaceService.getPlacesByOwnerId(ownerId);
    
    res.status(200).json({
      success: true,
      count: places.length,
      data: places
    });
  } catch (err) {
    console.error('Error fetching owner places:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching places by owner', 
      error: err 
    });
  }
};