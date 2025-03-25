import express from 'express';
import {
    createFightHistoryController,
    updateFightHistoryController,
    getFightHistoriesController,
    getFightHistoryByIdController,
    deleteFightHistoryController
} from '../controllers/fightHistory.controller'

const route = express.Router();

//เอาประวัติการต่อสู้ทั้งหมด
route.get('/fightHistory', getFightHistoriesController);

// เอาประวัติการต่อสู้จาก _id
route.get('/fightHistories/:id', getFightHistoryByIdController);

// สร้าง FightHistory
route.post('/fightHistories', createFightHistoryController);

// update FightHistory
route.put('/fightHistory/:id', updateFightHistoryController);

// ลบ FightHistory
route.delete('/fightHistory/:id', deleteFightHistoryController);

export default route;