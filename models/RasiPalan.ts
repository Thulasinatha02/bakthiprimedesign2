import mongoose, { Schema } from 'mongoose';

const RasiPalanSchema = new Schema(
  {
    rasi: { type: String, required: true }, // e.g. "Mesham", "Rishabham"
    rasiKey: { type: String, required: true }, // e.g. "aries", "taurus" (useful for routing)
    type: { type: String, required: true }, // e.g. "daily", "weekly", "monthly", "peyarchi_guru", "peyarchi_sani", "puthandu_tamil", "puthandu_english"
    prediction: { type: String, required: true },
    date: { type: String, required: true }, // e.g. "YYYY-MM-DD" or "YYYY-MM" or "2026"
    youtubeUrl: { type: String, default: '' },
  },
  { timestamps: true, collection: 'rasipalan' }
);

export default mongoose.models.RasiPalan || mongoose.model('RasiPalan', RasiPalanSchema);
