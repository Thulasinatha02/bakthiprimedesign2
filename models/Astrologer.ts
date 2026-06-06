import mongoose, { Schema } from 'mongoose';

const AstrologerSchema = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String, default: '' },
    specialty: { type: String, required: true }, // e.g. "Vedic Astrology", "Numerology", "Palmistry"
    experience: { type: Number, required: true }, // in years
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.Astrologer || mongoose.model('Astrologer', AstrologerSchema);
