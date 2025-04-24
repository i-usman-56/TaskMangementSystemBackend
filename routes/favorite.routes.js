import express from 'express';
import { addFavoriteTask, getAllFavoriteTasksForAdmin, getFavoriteTasks } from '../controllers/favoriteController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Route to add a task to favorites
router.post('/favorites', authMiddleware,roleMiddleware('admin'), addFavoriteTask); // Ensure the user is authenticated

// Route to get all favorite tasks for the logged-in user
router.get('/favorites/:id', authMiddleware, getFavoriteTasks); // Ensure the user is authenticated
router.get('/all', authMiddleware,roleMiddleware('admin') ,getAllFavoriteTasksForAdmin); // Ensure the user is authenticated

export default router;
