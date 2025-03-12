import express from 'express';
import { serveImage } from '../controllers/image.controller';

const router = express.Router();

// Route สำหรับรับ request ภาพ
// GET /images/*
router.get('/*', serveImage);

export default router;