import Issue from '../models/Issue.js';
import mongoose from 'mongoose';

export const getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate('user', 'name email phone')
      .sort({ dateReported: -1 });

    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ user: req.user.id })
      .populate('user', 'name email phone')
      .sort({ dateReported: -1 });

    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createIssue = async (req, res) => {
  try {
    const { title, description, status, location } = req.body;

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const newIssue = new Issue({
      title,
      description,
      status,
      location,
      imageUrl,
      user: req.user.id,
    });

    await newIssue.save();
    res.status(201).json(newIssue);
  } catch (err) {
    console.error('Error creating issue:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    if (issue.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to update this issue' });
    }

    Object.assign(issue, req.body);
    await issue.save();

    await issue.populate('user', 'name email phone');

    res.json(issue);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    if (issue.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this issue' });
    }

    await issue.deleteOne();
    res.json({ message: 'Issue deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSingleIssue = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid issue id' });
    }

    const issue = await Issue.findById(req.params.id).populate('user', 'name email phone');
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    res.json(issue);
  } catch (err) {
    console.error('Error fetching single issue:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Add an upvote from the logged-in user
 */
export const upvoteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    const userId = req.user.id;

    // Check if user already upvoted
    if (!issue.upvotes.some((id) => id.toString() === userId)) {
      issue.upvotes.push(userId);
      await issue.save();
    }

    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Remove an upvote from the logged-in user
 */
export const removeUpvote = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    const userId = req.user.id;

    issue.upvotes = issue.upvotes.filter((id) => id.toString() !== userId);
    await issue.save();

    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
