import Issue from '../models/Issue.js';
import Notification from '../models/Notification.js';

export const updateIssueStatus = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    const { status } = req.body;

    // ✅ Only proceed if a new, valid status is provided and it is different
    if (!status || status === issue.status) {
      return res.status(200).json({ message: 'No status change needed', issue });
    }

    issue.status = status;
    await issue.save();

    // 🔔 Create notification for the issue's creator
   /* await Notification.create({
      user: issue.user,
      message: `Your issue "${issue.title}" status changed to "${status}".`,
      issue: issue._id,
      type: 'statusChange',
    });*/

    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
