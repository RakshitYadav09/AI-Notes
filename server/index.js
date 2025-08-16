// Entry point for the Express backend
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// API routes
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('AI Notes Summarizer Backend Running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
