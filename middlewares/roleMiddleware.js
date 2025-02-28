const roleMiddleware = (role) => (req, res, next) => {
    if (req.user.role !== role) {
        return res.status(403).json({ error: 'Access denied. You do not have the required permissions.' });
    }
    next();
};

export default roleMiddleware;
