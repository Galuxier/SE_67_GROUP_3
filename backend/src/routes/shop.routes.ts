import express from 'express';
import {
    createShopController,
    getShopsController,
    getShopByIdController,
    updateShopController,
    deleteShopController,
    getUserShopsController,
    checkShopNameController
} from '../controllers/shop.controller';
import createMultiFieldUploader from '../middlewares/uploads/shop.upload';
import { getOrdersByShopIdController } from '../controllers/order.controller';
import { shopUpload } from '../middlewares/uploads/shop.upload';
// Create a router instance
const router = express.Router();

// Configure the shop image uploader
// const shopUpload = createMultiFieldUploader(
//     [
//       { name: 'logo', maxCount: 1 },
//       { name: 'license', maxCount: 1 },
//     ],
//     'shops',
//     ['image/']
// );

// Route to create a new shop
router.post('/shops', shopUpload, createShopController);

// Route to get all shops
router.get('/shops', getShopsController);

// Route to get shops by user ID (must be before /shop/:id)
router.get('/shops/user/:id', getUserShopsController);

// Route to get shop by ID
router.get('/shop/:id', getShopByIdController);

// Route to update shop
router.put('/shop/:id', shopUpload, updateShopController);

// Route to delete shop
router.delete('/shop/:id', deleteShopController);

router.get('/shop/orders/:shop_id', getOrdersByShopIdController);

router.get('/shop/check-name/:shopName', checkShopNameController);

// Export the router
export default router;  