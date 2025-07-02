// controllers/userController.js
import User from '../models/User.js';

export const getProfile = async (req, res) => {
    try {
        console.log('req.user:', req.user); 
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;

    if (req.file) {
        user.avatar = req.file.filename;  // save ONLY filename, NOT path
      }
    await user.save();
    res.json({ message: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
};

import Issue from '../models/Issue.js';

export const getUserIssueStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const pending = await Issue.countDocuments({ user: userId, status: 'Pending' });
    const resolved = await Issue.countDocuments({ user: userId, status: 'Resolved' });
    const rejected = await Issue.countDocuments({ user: userId, status: 'Rejected' });

    res.json({ pending, resolved, rejected });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch issue stats for user' });
  }
};
