import mongoose, { Schema } from 'mongoose';

const SpiritualPostSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true }, // e.g. "Mantras", "Slokas", "Rituals", "Stories"
    image: { type: String, default: '' },
  },
  { timestamps: true, collection: 'spiritual_posts' }
);

export default mongoose.models.SpiritualPost || mongoose.model('SpiritualPost', SpiritualPostSchema);
