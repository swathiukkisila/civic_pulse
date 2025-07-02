import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};


export const register = async (req, res) => {
  const { name, email, password,phone } = req.body;
  const avatar = req.file ? req.file.filename : null;  // get uploaded avatar filename

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, phone , avatar });
    res.status(201).json({ message: 'Registration successful. Please log in.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


export const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      const token = generateToken(user);
      res.status(200).json({
        user: { id: user._id, name: user.name, email: user.email },
        token,
      });
    } catch (err) {
      console.error('Login Error:', err); // Add this line
      res.status(500).json({ message: 'Server error' });
    }
  };
  