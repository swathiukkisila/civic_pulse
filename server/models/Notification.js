import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // recipient
    message: { type: String, required: true },
    issue: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue' },
    isRead: { type: Boolean, default: false },
    type: { type: String, enum: ['comment', 'statusChange'], required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
