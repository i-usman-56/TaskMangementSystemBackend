import Favorite from '../models/Favorite.js';
import Task from '../models/Task.js';

export const createTask = async (req, res) => {
    try {
        const task = new Task(req.body);
        console.log(task)
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: 'Error creating task' });
    }
};
export const getTasksByUserId = async (req, res) => {
    try {
        const userId = req.params.id; // Get the user ID from the URL

        // Fetch all favorite task IDs
        const favorites = await Favorite.find().select('taskId').lean();
        const favoriteTaskIds = new Set(favorites.map(fav => fav.taskId.toString())); // Create a Set of favorite task IDs

        // Fetch tasks assigned to the user, sorted by createdAt in descending order
        const tasks = await Task.find({ assignedTo: userId })
            .populate('assignedTo', 'username')
            .sort({ createdAt: -1 }) // Sort by createdAt field in descending order
            .lean(); // Convert to plain JavaScript objects

        // Map through tasks to include isFavorite flag
        const result = tasks.map(task => ({
            ...task, // Spread existing task properties
            isFavorite: favoriteTaskIds.has(task._id.toString()) // Check if task is in favorites
        }));

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching tasks assigned to the user' });
    }
};



export const getAllTasks = async (req, res) => {
    try {
        // Fetch all favorite task IDs
        const favorites = await Favorite.find().select('taskId').lean();
        const favoriteTaskIds = new Set(favorites.map(fav => fav.taskId.toString())); // Create a Set of favorite task IDs

        // Fetch all tasks, sorted by createdAt or updatedAt in descending order
        const tasks = await Task.find()
            .populate('assignedTo', 'username')  // Populate the 'assignedTo' field with the 'username'
            .sort({ createdAt: -1 })  // Sort by createdAt field in descending order
            .exec();

        // Map through tasks to include isFavorite flag
        const result = tasks.map(task => ({
            ...task.toObject(), // Convert mongoose document to plain object
            isFavorite: favoriteTaskIds.has(task._id.toString()) // Check if task is in favorites
        }));

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching tasks' });
    }
};


export const updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Error updating task' });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting task' });
    }
};
