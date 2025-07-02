import Comment from '../models/Comment.js';
import Issue from '../models/Issue.js';
import Notification from '../models/Notification.js';

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { issueId } = req.params;

    const userId = req.user.id;
    const userModel = req.user.role === 'admin' ? 'Admin' : 'User';

    const newComment = new Comment({
      text,
      issue: issueId,
      user: userId,
      userModel,
    });

    await newComment.save();
    await newComment.populate('user', 'name');

    // 🔔 Send notification to issue owner (if commenter is not the owner)
    const issue = await Issue.findById(issueId);
    if (issue && issue.user.toString() !== userId) {
      await Notification.create({
        user: issue.user,
        message: `Someone commented on your issue "${issue.title}".`,
        issue: issue._id,
        type: 'comment',
      });
    }

    res.status(201).json(newComment);
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ message: 'Failed to add comment' });
  }
};

export const getComments = async (req, res) => {
  try {
    const { issueId } = req.params;

    const comments = await Comment.find({ issue: issueId })
      .populate('user', 'name') // Handles both Admin & User names
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
};
