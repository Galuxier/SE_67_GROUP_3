// src/services/adsPackage.service.ts
import { ObjectId } from 'mongoose';
import { AdsPackageModel, AdsPackageDocument } from '../models/adsPackage.model';

// สร้าง Ads Package ใหม่
export const createAdsPackage = async (adsPackageData: Partial<AdsPackageDocument>) => {
  const newAdsPackage = await AdsPackageModel.create(adsPackageData);
  return newAdsPackage;
};

// ดึงข้อมูล Ads Package ทั้งหมด
export const getAdsPackages = async () => {
  return await AdsPackageModel.find();
};

// ดึงข้อมูล Ads Package ตาม ID
export const getAdsPackageById = async (adsPackageId: string) => {
  return await AdsPackageModel.findById(adsPackageId);
};

// อัปเดตข้อมูล Ads Package
export const updateAdsPackage = async (
  adsPackageId: string,
  updateData: Partial<AdsPackageDocument>
) => {
  const adsPackage = await AdsPackageModel.findById(adsPackageId);
  if (!adsPackage) {
    throw new Error('AdsPackage not found');
  }
  Object.assign(adsPackage, updateData);
  await adsPackage.save();
  return adsPackage;
};

// ลบ Ads Package
export const deleteAdsPackage = async (adsPackageId: string) => {
  const adsPackage = await AdsPackageModel.findByIdAndDelete(adsPackageId);
  if (!adsPackage) {
    throw new Error('AdsPackage not found');
  }
  return adsPackage;
};
