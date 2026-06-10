import mongoose, { Schema } from 'mongoose';

const HeroSlideSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    badge: { type: String, default: '' },
    image: { type: String, default: '' },
    youtubeUrl: { type: String, default: '' },
    youtubeVideoId: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'hero_slides' }
);

export default mongoose.models.HeroSlide || mongoose.model('HeroSlide', HeroSlideSchema);
