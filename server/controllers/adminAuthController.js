import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';


const generateAdminToken = (admin) => {
  return jwt.sign(
    { id: admin._id, isAdmin: true }, // ✅ include isAdmin flag
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateAdminToken(admin);
    res.status(200).json({ token });
  } catch (err) {
    console.error('Admin Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

