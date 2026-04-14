import express from 'express';
import { signup,login,logout,updateProfile} from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/signup', rateLimiter, signup);

router.post('/login', rateLimiter, login);

router.post('/logout', logout);

router.put('/update-profile',protectRoute ,updateProfile);

router.get('/check', protectRoute, (req,res) => {
    res.status(200).json({ message: 'You are authenticated', user: req.user });
});

export default router;