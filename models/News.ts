import mongoose, { Schema } from 'mongoose';

const NewsSchema = new Schema(
  {
    titleTamil: { type: String, required: true },
    titleEnglish: { type: String, required: true },
    descriptionTamil: { type: String, required: true },
    descriptionEnglish: { type: String, required: true },
    category: { type: String, required: true }, // e.g. "Sports", "Politics", "Education", "Spiritual", "Technology", "Cinema"
    image: { type: String, default: '' },
    youtubeUrl: { type: String, default: '' },
    youtubeVideoId: { type: String, default: '' },
    isImportant: { type: Boolean, default: false },
    isLatest: { type: Boolean, default: false },
    publishDate: { type: Date, default: Date.now },
  },
  { timestamps: true, collection: 'news' }
);

export default mongoose.models.News || mongoose.model('News', NewsSchema);

