import mongoose, { Schema } from 'mongoose';

const VideoSchema = new Schema(
  {
    title: { type: String, required: true },
    youtubeUrl: { type: String, required: true },
    description: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.Video || mongoose.model('Video', VideoSchema);
