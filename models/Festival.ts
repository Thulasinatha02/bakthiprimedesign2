import mongoose, { Schema } from 'mongoose';

const FestivalSchema = new Schema(
  {
    name: { type: String, required: true },
    date: { type: String, required: true },
    significance: { type: String, required: true },
    rituals: { type: String, default: '' },
    image: { type: String, default: '' },
  },
  { timestamps: true, collection: 'festivals' }
);

export default mongoose.models.Festival || mongoose.model('Festival', FestivalSchema);
