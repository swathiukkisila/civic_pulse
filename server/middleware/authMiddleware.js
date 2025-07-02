import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Admin from '../models/Admin.js';

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // First check user collection
    const user = await User.findById(decoded.id).select('-password');
    if (user) {
      req.user = {
        id: user._id.toString(),
        ...user._doc,
        isAdmin: false,
        role: 'user', // 👈 Added
      };
      return next();
    }

    // Then check admin collection
    const admin = await Admin.findById(decoded.id).select('-password');
    if (admin) {
      req.user = {
        id: admin._id.toString(),
        ...admin._doc,
        isAdmin: true,
        role: 'admin', // 👈 Added
      };
      return next();
    }

    return res.status(401).json({ message: 'Unauthorized user' });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default authMiddleware;
