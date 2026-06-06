import mongoose, { Schema } from 'mongoose';

const NewsSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, default: '' },
    category: { type: String, required: true }, // e.g. "News", "Sports", "Cinema", "Spiritual", "Astrology"
  },
  { timestamps: true, collection: 'news' }
);

export default mongoose.models.News || mongoose.model('News', NewsSchema);
