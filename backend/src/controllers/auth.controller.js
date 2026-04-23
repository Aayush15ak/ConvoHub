import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';
import { sendWelcomeEmail } from '../emails/emailHandlers.js';
import cloudinary from '../lib/cloudinary.js';
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

export const login = async (req,res) =>{
    const {email , password} = req.body;
    try{
        if(!email || !password){
            return res.status(400).json({message: 'All fields are required'});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: 'User not found'});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message: 'Invalid credentials'});
        }

        generateToken(user._id,res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        });
    }
    catch(error){
        console.error('Error in login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const logout = async (_,res) => {
    // jwt is not enough to uniquely identify it.The browser identifies my jwt cookie using a combination of: name + domain + path + secure + sameSite
    res.clearCookie('jwt',{
        httpOnly: true,
        sameSite : 'strict',
        secure : process.env.NODE_ENV === 'production' ? true : false
    });
    res.status(200).json({ message: 'Logged out successfully' });
}

export const updateProfile = async (req,res) => {
    try{
        const {profilePic} = req.body;
        if(!profilePic){
            return res.status(400).json({ message: 'Profile picture is required' });
        }
        const userId = req.user._id;
        const result = await cloudinary.uploader.upload(profilePic, {
            folder: "profile_pics",
        });
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: result.secure_url }, { returnDocument : 'after' }).select('-password');
        if(!updatedUser){
            return res.status(500).json({ message: 'Failed to update profile' });
        }
        res.status(200).json(updatedUser);
    }
    catch (error) {
        console.error("FULL ERROR:", error);
        console.error("RESPONSE:", error?.response);
        return res.status(500).json({ message: error.message });
    }
}