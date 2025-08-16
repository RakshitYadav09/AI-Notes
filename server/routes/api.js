
import express from 'express';
import Summary from '../models/Summary.js';
import { generateSummary } from '../utils/gemini.js';
import { sendSummaryEmail } from '../utils/email.js';
const router = express.Router();

// GET /api/summaries
// List all summaries (for debugging)
router.get('/summaries', async (req, res) => {
  try {
    const summaries = await Summary.find().sort({ createdAt: -1 });
    res.json(summaries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch summaries.' });
  }
});

// POST /api/summarize
// Receives transcript and prompt, returns summary (calls Gemini API)
router.post('/summarize', async (req, res) => {
  const { transcript, prompt } = req.body;
  if (!transcript || !prompt) {
    return res.status(400).json({ error: 'Transcript and prompt are required.' });
  }

  try {
    const summary = await generateSummary(transcript, prompt);
    // Save to DB
    const saved = await Summary.create({ transcript, prompt, summary });
    res.json({ summary: saved.summary, id: saved._id });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to generate summary.' });
  }
});

// PUT /api/summaries/:id
// Update summary text
router.put('/summaries/:id', async (req, res) => {
  const { summary } = req.body;
  try {
    const updated = await Summary.findByIdAndUpdate(
      req.params.id,
      { summary },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Summary not found.' });
    }
    res.json(updated);
  } catch (err) {
    console.error('Update summary error:', err);
    res.status(500).json({ error: 'Failed to update summary.' });
  }
});

// POST /api/share
// Send summary via email
router.post('/share', async (req, res) => {
  const { summary, recipients } = req.body;
  if (!summary || !recipients || !recipients.length) {
    return res.status(400).json({ error: 'Summary and recipients are required.' });
  }
  try {
    await sendSummaryEmail({ summary, recipients });
    res.json({ message: 'Email sent successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to send email.' });
  }
});

export default router;
