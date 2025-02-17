import express from 'express';
import{
    createShopController,
    getShopsController,
    getShopByIdController,
    updateShopController,
    deleteShopController
} from '../controllers/shop.controller';

const router = express.Router();

router.post('/shops', createShopController);

router.get('/shops', getShopsController);

router.get('/shop/:id', getShopByIdController);

router.put('/shop/:id', updateShopController);

router.delete('/shop/:id', deleteShopController);

export default router;