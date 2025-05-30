import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const requireSignin = async (req, res, next) => {
    const { authorization } = req.headers;
    
    if (!authorization) {
        return res.status(401).json({ error: "Authentication token required" });
    }

    const token = authorization.split(" ")[1];
  
    try {
        const { _id } = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findOne({ _id }).select('_id'); 
        next();
  
    } catch (error) {
        res.status(401).json({ error: 'Request is not authorized' });
    }
};



export const isTeacher = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        if (user.role !== 'teacher') {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access"
            });
        }
        next();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};