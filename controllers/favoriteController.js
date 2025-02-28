import Favorite from '../models/Favorite.js';

export const addFavoriteTask = async (req, res) => {
    try {
        const { userId, taskId } = req.body; // Taking userId and taskId from request body

        // Check if the favorite already exists
        const existingFavorite = await Favorite.findOne({ userId, taskId });
        if (existingFavorite) {
            return res.status(400).json({ message: 'Task is already in favorites' });
        }

        // Create a new favorite entry
        const favorite = new Favorite({ userId, taskId });
        await favorite.save();
        res.status(201).json({ message: 'Task added to favorites', favorite });
    } catch (error) {
        res.status(500).json({ error: 'Error adding task to favorites' });
    }
};

// Get all favorite tasks for admin
// Get all favorite tasks for admin
// Get all favorite tasks for admin
export const getAllFavoriteTasksForAdmin = async (req, res) => {
    try {
        const favorites = await Favorite.find()
            .populate({
                path: 'taskId',
                select: 'title description assignedTo status createdAt updatedAt', // Include additional fields
                populate: {
                    path: 'assignedTo',
                    select: 'username', // Select only the username
                }
            })
            .populate({
                path: 'userId',
                select: 'username', // Select only the username from User
            })
            .lean(); // Convert to plain JavaScript objects

        // Filter out favorites with null taskId and transform the response
        const uniqueTasks = new Set(); // To track unique task IDs
        const result = favorites
            .filter(favorite => favorite.taskId !== null)
            .filter(favorite => {
                if (uniqueTasks.has(favorite.taskId._id)) {
                    return false; // Skip if the task ID is already encountered
                }
                uniqueTasks.add(favorite.taskId._id); // Add to the set
                return true; // Keep this task
            })
            .map(favorite => ({
                _id: favorite.taskId._id,
                title: favorite.taskId.title,
                description: favorite.taskId.description,
                assignedTo: {
                    _id: favorite.taskId.assignedTo._id,
                    username: favorite.taskId.assignedTo.username,
                },
                status: favorite.taskId.status,
                createdAt: favorite.taskId.createdAt,
                updatedAt: favorite.taskId.updatedAt,
                isFavorite: true
            }))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by createdAt in descending order

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching all favorite tasks' });
    }
};


// Get all favorite tasks for the specified userId
export const getFavoriteTasks = async (req, res) => {
    try {
        const userId = req.params.id; // Taking userId from request parameters
        const favorites = await Favorite.find({ userId })
            .populate({
                path: 'taskId',
                select: 'title description assignedTo status createdAt updatedAt', // Include additional fields
                populate: {
                    path: 'assignedTo',
                    select: 'username', // Select only the username
                }
            })
            .populate({
                path: 'userId',
                select: 'username', // Select only the username from User
            })
            .lean(); // Convert to plain JavaScript objects

        // Transform and filter out favorites with null taskId
        const uniqueTasks = new Set(); // To track unique task IDs
        const result = favorites
            .filter(favorite => favorite.taskId !== null)
            .filter(favorite => {
                if (uniqueTasks.has(favorite.taskId._id)) {
                    return false; // Skip if the task ID is already encountered
                }
                uniqueTasks.add(favorite.taskId._id); // Add to the set
                return true; // Keep this task
            })
            .map(favorite => ({
                _id: favorite.taskId._id, // Include task ID
                title: favorite.taskId.title,
                description: favorite.taskId.description,
                assignedTo: {
                    _id: favorite.taskId.assignedTo._id, // Include assigned user ID
                    username: favorite.taskId.assignedTo.username,
                },
                status: favorite.taskId.status,
                createdAt: favorite.taskId.createdAt,
                updatedAt: favorite.taskId.updatedAt,
                isFavorite: true
            }))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by createdAt in descending order

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching favorite tasks' });
    }
};




