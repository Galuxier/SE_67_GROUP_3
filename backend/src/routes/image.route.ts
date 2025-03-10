import express from 'express';
import { serveImage } from '../controllers/image.controller';

const router = express.Router();

// GET /images/:imageName
router.get('/:imageName', serveImage);

export default router;