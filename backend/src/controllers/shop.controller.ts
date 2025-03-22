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

export const getUserShops = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;  // Change from user_id to id to match route parameter

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const shops = await ShopService.getUserShops(new Types.ObjectId(id));

    // Return an empty array instead of 404 when no shops are found
    // This allows your frontend to handle the empty state properly
    res.status(200).json(shops);
  } catch (error) {
    console.error('Error fetching user shops:', error);
    res.status(500).json({ message: 'Server error' });
  }
};