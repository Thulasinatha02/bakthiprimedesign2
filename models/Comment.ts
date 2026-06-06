import mongoose, { Schema } from 'mongoose';

const CommentSchema = new Schema(
  {
    name: { type: String, required: true },
    content: { type: String, required: true },
    targetKey: { type: String, required: true }, // e.g. "aries"
    targetType: { type: String, required: true }, // e.g. "daily", "weekly", "puthandu_tamil" etc.
  },
  { timestamps: true, collection: 'comments' }
);

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
