import { Request, Response } from 'express';
import AdsPackageService from '../services/adsPackage.service';

// สร้างแพ็คเกจโฆษณาใหม่
export const createAdsPackageController = async (req: Request, res: Response) => {
  try {
    const newAdsPackage = await AdsPackageService.add(req.body);
    res.status(201).json(newAdsPackage);
  } catch (err) {
    res.status(400).json({ message: 'Error creating ads package', error: err });
  }
};

// ดึงข้อมูลแพ็คเกจโฆษณาทั้งหมด
export const getAdsPackagesController = async (req: Request, res: Response) => {
  try {
    const adsPackages = await AdsPackageService.getAll();
    res.status(200).json(adsPackages);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching ads packages', error: err });
  }
};

// ดึงข้อมูลแพ็คเกจโฆษณาจาก _id
export const getAdsPackageByIdController = async (req: Request, res: Response) => {
  try {
    const adsPackage = await AdsPackageService.getById(req.params.id);
    if (!adsPackage) {
      res.status(404).json({ message: 'Ads package not found' });
      return;
    }
    res.status(200).json(adsPackage);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching ads package', error: err });
  }
};

// อัปเดตข้อมูลแพ็คเกจโฆษณา
export const updateAdsPackageController = async (req: Request, res: Response) => {
  try {
    const updatedAdsPackage = await AdsPackageService.update(req.params.id, req.body);
    res.status(200).json(updatedAdsPackage);
  } catch (err) {
    res.status(500).json({ message: 'Error updating ads package', error: err });
  }
};

// ลบแพ็คเกจโฆษณา
export const deleteAdsPackageController = async (req: Request, res: Response) => {
  try {
    const deletedAdsPackage = await AdsPackageService.delete(req.params.id);
    res.status(200).json(deletedAdsPackage);
  } catch (err) {
    res.status(500).json({ message: 'Error deleting ads package', error: err });
  }
};