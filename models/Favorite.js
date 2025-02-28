import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
}, { timestamps: true });

export default mongoose.model('Favorite', favoriteSchema);
