const router = require('express').Router();
const Appointment = require('../models/Appointment');
const { authenticate } = require('../middleware/auth');

function makeAptId() {
  return 'APT-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7).toUpperCase();
}

// ── POST / ── Create appointment (called by n8n webhook after scoring) ────────
router.post('/', authenticate, async (req, res) => {
  try {
    const b = req.body;
    const appointment_id = b.appointment_id || makeAptId();
    const apt = await Appointment.create({ ...b, appointment_id, status: b.status || 'scheduled' });
    return res.status(201).json(apt);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// ── GET / ── List appointments ───────────────────────────────────────────────
router.get('/', authenticate, async (req, res) => {
  try {
    const q = req.query;
    const filter = {};
    if (q.date) filter.appointment_date = q.date;
    if (q.patient_id) filter.patient_id = q.patient_id;
    if (q.doctor_id) filter.doctor_id = q.doctor_id;
    if (q.risk_level) filter.risk_level = q.risk_level.toUpperCase();
    if (q.status) filter.status = q.status;
    if (q.from || q.to) {
      filter.appointment_date = {};
      if (q.from) filter.appointment_date.$gte = q.from;
      if (q.to) filter.appointment_date.$lte = q.to;
    }
    const apts = await Appointment.find(filter).lean();
    return res.json(apts);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// ── GET /:id ── Single appointment ───────────────────────────────────────────
router.get('/:id', authenticate, async (req, res) => {
  try {
    const apt = await Appointment.findOne({ appointment_id: req.params.id });
    if (!apt) return res.status(404).json({ message: 'Not found' });
    return res.json(apt);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// ── PUT /:id ── Update appointment ───────────────────────────────────────────
router.put('/:id', authenticate, async (req, res) => {
  try {
    const allowed = [
      'appointment_date', 'appointment_hour', 'specialty', 'status',
      'patient_confirmed', 'patient_declined', 'notes', 'doctor_id', 'clinic_name',
    ];
    const upd = {};
    for (const k of allowed) {
      if (req.body[k] !== undefined) upd[k] = req.body[k];
    }
    const apt = await Appointment.findOneAndUpdate(
      { appointment_id: req.params.id },
      { $set: upd },
      { new: true }
    );
    if (!apt) return res.status(404).json({ message: 'Not found' });
    return res.json(apt);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// ── DELETE /:id ── Cancel appointment ────────────────────────────────────────
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const apt = await Appointment.findOneAndUpdate(
      { appointment_id: req.params.id },
      { $set: { status: 'cancelled', cancelled_at: new Date().toISOString() } },
      { new: true }
    );
    if (!apt) return res.status(404).json({ message: 'Not found' });
    return res.json({ message: 'Appointment cancelled', appointment_id: apt.appointment_id });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
