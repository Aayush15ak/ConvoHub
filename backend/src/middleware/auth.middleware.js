import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import dotenv from 'dotenv';
dotenv.config();

export const protectRoute = async (req ,res , next) => {
    try{
        const token  = req.cookies.jwt;
        if(!token){
            return res.status(401).json({ message: 'Unauthorized- No token provided' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({ message: 'Unauthorized- Invalid token' });
        }
        const user = await User.findById(decoded.id).select('-password'); // we are not selecting password field because we don't want to send password in response, we just want to check if user exists or not
        if(!user){
            return res.status(401).json({ message: 'Unauthorized- User not found' });
        }
        req.user = user; // attached user to request object as we are using this middleware in update profile route, so we can access user info in update profile controller through req.user
        next();
    }
    catch(error){
        console.error('Error in protectRoute middleware:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}