import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';
import { sendWelcomeEmail } from '../emails/emailHandlers.js';
import dotenv from 'dotenv';

dotenv.config();

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        // Validate input
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();

        if(!savedUser) {
            return res.status(500).json({ message: 'Failed to create user' });
        }

        // Generate token (cookie or JWT)
        generateToken(savedUser._id, res);

        // Send response
        res.status(201).json({
            _id: savedUser._id,
            fullName: savedUser.fullName,
            email: savedUser.email,
            profilePic: savedUser.profilePic
        });

        // Send welcome email
        // try {
        //     await sendWelcomeEmail(savedUser.email, savedUser.fullName, process.env.CLIENT_URL);
        // }
        //if i had a domain i would use the user's email to send the welcome email, but since i dont have one i will use the default temporary email provider by render to send the welcome email to itself for testing purposes
        
        try{
            await sendWelcomeEmail(process.env.EMAIL_TO, savedUser.fullName, process.env.CLIENT_URL);
        }
        catch (error) {
            console.error('Error sending welcome email:', error);
        }

    } catch (error) {
        console.error('Error in signup:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};