// src/controllers/ownPackage.controller.ts
import { Request, Response } from 'express';
import OwnPackageService from '../services/ownPackage.service';
import { OwnPackageType } from '../models/ownPackage.model';

export const createOwnPackagesFromOrderController = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    
    // Create own packages from the order
    const createdPackages = await OwnPackageService.createFromOrder(orderId);
    
    res.status(201).json({
      success: true,
      message: `Created ${createdPackages.length} packages from order`,
      data: createdPackages
    });
  } catch (err) {
    console.error('Error creating own packages from order:', err);
    res.status(400).json({ 
      success: false, 
      message: 'Error creating own packages', 
      error: err 
    });
  }
};

export const getUserPackagesController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { type } = req.query;
    
    // Validate type parameter if provided
    if (type && !Object.values(OwnPackageType).includes(type as OwnPackageType)) {
      res.status(400).json({
        success: false,
        message: `Invalid package type. Must be one of: ${Object.values(OwnPackageType).join(', ')}`
      });
      return;
    }
    
    // Get active packages for the user
    const packages = await OwnPackageService.getUserActivePackages(
      userId, 
      type as OwnPackageType | undefined
    );
    
    res.status(200).json({
      success: true,
      count: packages.length,
      data: packages
    });
  } catch (err) {
    console.error('Error fetching user packages:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching user packages', 
      error: err 
    });
  }
};

export const usePackageController = async (req: Request, res: Response) => {
  try {
    const { packageId } = req.params;
    const { refId } = req.body;
    
    if (!refId) {
      res.status(400).json({
        success: false,
        message: 'Reference ID (refId) is required'
      });
      return;
    }
    
    // Mark the package as used
    const updatedPackage = await OwnPackageService.usePackage(packageId, refId);
    
    res.status(200).json({
      success: true,
      message: 'Package successfully used',
      data: updatedPackage
    });
  } catch (err) {
    console.error('Error using package:', err);
    res.status(400).json({ 
      success: false, 
      message: 'Error using package', 
      error: err 
    });
  }
};

export const processExpiredPackagesController = async (req: Request, res: Response) => {
  try {
    // Process expired packages
    const updatedCount = await OwnPackageService.processExpiredPackages();
    
    res.status(200).json({
      success: true,
      message: `Successfully processed ${updatedCount} expired packages`,
      updatedCount
    });
  } catch (err) {
    console.error('Error processing expired packages:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error processing expired packages', 
      error: err 
    });
  }
};