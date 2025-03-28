import express from 'express';
import { register, login, verifyPasswordController } from '../controllers/auth.controller';


const router = express.Router();

// Route for registering a new user
router.post('/register', register);

// Route for logging in
router.post('/login', login);

router.post('/verify-password', verifyPasswordController);

export default router;
