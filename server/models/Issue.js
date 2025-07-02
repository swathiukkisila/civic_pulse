import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,

    status: {
      type: String,
      enum: ['Pending', 'Resolved', 'Rejected'],
      default: 'Pending',
    },

    location: String,
    dateReported: { type: Date, default: Date.now },
    imageUrl: String,

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true, // ✅ Adds createdAt and updatedAt fields automatically
  }
);

const Issue = mongoose.model('Issue', issueSchema);
export default Issue;
