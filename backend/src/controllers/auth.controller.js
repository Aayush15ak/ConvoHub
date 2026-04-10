import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    try{
        if(!fullName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if(password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // check redundant signups
        const user = await User.findOne({email : email});
        if(user) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // now since email is verified as not redundant, we can create the user ..
        //we will hash the password before saving to db
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create the user
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });

        if(newUser){
            const savedUser = await newUser.save();
            generateToken(savedUser._id,res);
            res.status(201).json({
                _id : savedUser._id,
                fullName : savedUser.fullName,
                email : savedUser.email,
                profilePic : savedUser.profilePic
            });
        }
        else{
            res.status(500).json({ message: 'Failed to create user' });
        }

    }
    catch (error) {
        console.error('Error in signup:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}