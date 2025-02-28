import express from 'express';
import { createTask, updateTask, deleteTask, getAllTasks, getTasksByUserId } from '../controllers/taskController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Create a task (only for authenticated users)
router.post('/', authMiddleware,roleMiddleware('admin'), createTask);

// Update a task (only for authenticated users)
router.put('/:id', authMiddleware, updateTask);

// Delete a task (only for admin users)
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteTask);

router.get('/tasks', getAllTasks);  // Route for getting all tasks
router.get('/tasks/:id', getTasksByUserId);  // Route for getting all tasks

export default router;
