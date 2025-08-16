import mongoose from 'mongoose';

const SummarySchema = new mongoose.Schema({
  transcript: { type: String, required: true },
  prompt: { type: String, required: true },
  summary: { type: String, required: true },
  recipients: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

const Summary = mongoose.model('Summary', SummarySchema);
export default Summary;
