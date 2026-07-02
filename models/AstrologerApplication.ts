import mongoose, { Schema } from 'mongoose';

const AstrologerApplicationSchema = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String, default: '' },
    specialty: { type: String, required: true },
    experience: { type: Number, required: true },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.AstrologerApplication || mongoose.model('AstrologerApplication', AstrologerApplicationSchema);
