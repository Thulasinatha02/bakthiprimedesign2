import mongoose, { Schema } from 'mongoose';

const TempleSchema = new Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    deity: { type: String, required: true },
    history: { type: String, required: true },
    image: { type: String, default: '' },
    timings: { type: String, default: '' },
  },
  { timestamps: true, collection: 'temples' }
);

export default mongoose.models.Temple || mongoose.model('Temple', TempleSchema);
