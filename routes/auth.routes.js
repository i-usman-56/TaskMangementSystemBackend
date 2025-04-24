import express from 'express';
import { signup, login, getUserDataById, getAllUser } from '../controllers/authController.js';
import { validateSignup, validateLogin } from '../validators/validateAuth.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Signup route
router.post('/signup', validateSignup, signup);

// Login route
router.post('/login', validateLogin, login);

// 
router.get('/user', authMiddleware, getUserDataById);
router.get('/', authMiddleware, getAllUser);

export default router;
