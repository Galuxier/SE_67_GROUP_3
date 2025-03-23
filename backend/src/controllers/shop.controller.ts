import { Request, Response } from 'express';
import ShopService from '../services/shop.service';
import { Types } from 'mongoose';

// สร้างร้านค้าใหม่
export const createShopController = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    console.log(req.files);

    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (files.logo) {
        req.body.logo = files.logo[0].path.replace(/^.*?uploads\//, '');
      }

      if (files.license) {
        req.body.license = files.license[0].path.replace(/^.*?uploads\//, '');
      }
    }

    if (req.body.contacts) {
      req.body.contacts = JSON.parse(req.body.contacts);
    }

    if (req.body.address) {
      req.body.address = JSON.parse(req.body.address);
    }

    console.log('Final Body:', req.body);

    const newShop = await ShopService.add(req.body);
    res.status(201).json(newShop);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Error creating shop', error: err });
  }
};

// ดึงข้อมูลร้านค้าทั้งหมด
export const getShopsController = async (req: Request, res: Response) => {
  try {
    const shops = await ShopService.getAll();
    res.status(200).json(shops);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching shops', error: err });
  }
};

// ดึงข้อมูลร้านค้าจาก _id
export const getShopByIdController = async (req: Request, res: Response) => {
  try {
    const shop = await ShopService.getById(req.params.id);
    if (!shop) {
      res.status(404).json({ message: 'Shop not found' });
      return;
    }
    res.status(200).json(shop);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching shop', error: err });
  }
};

// อัปเดตข้อมูลร้านค้า
export const updateShopController = async (req: Request, res: Response) => {
  try {
    const updatedShop = await ShopService.update(req.params.id, req.body);
    res.status(200).json(updatedShop);
  } catch (err) {
    res.status(500).json({ message: 'Error updating shop', error: err });
  }
};

// ลบร้านค้า
export const deleteShopController = async (req: Request, res: Response) => {
  try {
    const deletedShop = await ShopService.delete(req.params.id);
    res.status(200).json(deletedShop);
  } catch (err) {
    res.status(500).json({ message: 'Error deleting shop', error: err });
  }
};

// ดึงข้อมูลร้านค้าทั้งหมดของผู้ใช้ (โดย user_id)
export const getUserShopsController = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    
    // ตรวจสอบว่า ID ถูกต้องหรือไม่
    if (!Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: 'Invalid user ID format' });
    }
    
    const shops = await ShopService.getShopsByOwnerId(userId);
    
    // ส่งคืนข้อมูลร้านค้าทั้งหมดของผู้ใช้
    res.status(200).json({
      success: true,
      count: shops.length,
      data: shops
    });
  } catch (err) {
    console.error('Error fetching user shops:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching user shops', 
      error: err 
    });
  }
};

export const checkShopNameController = async (req: Request, res: Response) => {
  try {
    const { shopName } = req.params;
    
    if (!shopName) {
      res.status(400).json({ 
        success: false, 
        message: 'Shop name is required' 
      });
    }
    
    const exists = await ShopService.checkShopNameExists(shopName);
    
    // ส่งผลลัพธ์กลับไป
    res.status(200).json({
      success: true,
      exists: exists,
      message: exists ? 'Shop name already exists' : 'Shop name is available'
    });
  } catch (err) {
    console.error('Error checking shop name:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error checking shop name', 
      error: err 
    });
  }
};

export const getShopByNameController = async (req: Request, res: Response) => {
  try {
    const { shopName } = req.params;
    
    if (!shopName) {
      res.status(400).json({ message: 'Shop name is required' });
      return;
    }
    
    const shop = await ShopService.getShopByName(shopName);
    
    if (!shop) {
      res.status(404).json({ message: 'Shop not found' });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: shop
    });
  } catch (err) {
    console.error('Error fetching shop by name:', err);
    res.status(500).json({ message: 'Error fetching shop', error: err });
  }
};