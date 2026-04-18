const router = require('express').Router();
const Notification = require('../models/Notification');
const { authenticate } = require('../middleware/auth');

// ── GET /notifications ───────────────────────────────────────────────────────
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.query.user_id || req.auth.userId;
    if (!userId) return res.status(400).json({ message: 'user_id required' });

    const filter = { user_id: userId };
    if (req.query.type) filter.type = req.query.type;

    const notifications = await Notification.find(filter).sort({ timestamp: -1 }).lean();
    return res.json(notifications);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// ── DELETE /notifications ────────────────────────────────────────────────────
router.delete('/', authenticate, async (req, res) => {
  try {
    const userId = req.query.user_id || req.auth.userId;
    if (!userId) return res.status(400).json({ message: 'user_id required' });

    await Notification.deleteMany({ user_id: userId });
    return res.json({ message: 'Notifications cleared', user_id: userId });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// ── GET /sse/notifications ── Server-Sent Events stream ─────────────────────
router.get('/sse', authenticate, async (req, res) => {
  try {
    const userId = req.query.user_id || req.auth.userId;
    if (!userId) return res.status(400).json({ message: 'user_id required' });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const sendPending = async () => {
      const pending = await Notification.find({ user_id: userId, read: false }).lean();
      if (pending.length) {
        for (const n of pending) {
          res.write(`data: ${JSON.stringify(n)}\n\n`);
        }
        await Notification.deleteMany({ _id: { $in: pending.map((n) => n._id) } });
      }
    };

    // Send immediately, then poll every 5 seconds
    await sendPending();
    const interval = setInterval(sendPending, 5000);

    req.on('close', () => {
      clearInterval(interval);
      res.end();
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
