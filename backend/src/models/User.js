const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // ── Identity ──────────────────────────────────────────────
    user_id: { type: String, required: true, unique: true },
    type: {
      type: String,
      required: true,
      enum: ['patient', 'doctor', 'staff', 'admin'],
    },
    username: { type: String, sparse: true },
    password: { type: String },
    full_name: { type: String },
    email: { type: String },
    phone: { type: String },
    wilaya: { type: String },
    active: { type: Boolean, default: true },

    // ── Backward-compat aliases (denorm for appointment joins) ─
    patient_id: { type: String },      // set when type === 'patient'
    patient_name: { type: String },
    patient_phone: { type: String },
    doctor_id: { type: String },       // set when type === 'doctor'
    doctor_name: { type: String },

    // ── Patient-specific (optional) ───────────────────────────
    age: { type: Number },
    gender: { type: String },
    distance_km: { type: Number },
    payment_type: { type: String, default: 'Cash' },
    blood_type: { type: String },
    height_cm: { type: Number },
    weight_kg: { type: Number },
    bmi: { type: Number },
    allergies: { type: String },
    medical_conditions: { type: String },
    prior_no_shows: { type: Number, default: 0 },
    prior_visits: { type: Number, default: 0 },
    notes: { type: String },

    // ── Doctor-specific (optional) ────────────────────────────
    specialty: { type: String },
    clinic_name: { type: String, default: 'Doctome Clinic' },
    available_days: { type: [String], default: undefined },
    slot_duration_min: { type: Number },
    max_daily_patients: { type: Number },
    overbooking_allowed: { type: Boolean },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'users',
  }
);

// ── Indexes ──
userSchema.index({ type: 1 });
userSchema.index({ patient_id: 1 }, { sparse: true });
userSchema.index({ doctor_id: 1 }, { sparse: true });
userSchema.index({ username: 1 }, { sparse: true });
userSchema.index({ wilaya: 1 });
userSchema.index({ specialty: 1 }, { sparse: true });

module.exports = mongoose.model('User', userSchema);
