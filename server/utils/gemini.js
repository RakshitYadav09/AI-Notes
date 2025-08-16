// utils/gemini.js
// Handles Gemini API calls for summarization
import axios from 'axios';

export async function generateSummary(transcript, prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('Missing Gemini API key');

  // Use Gemini 2.0 Flash (gemini-2.0-flash) endpoint (production)
  const url = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=' + apiKey;
  const payload = {
    contents: [
      { role: 'user', parts: [
        { text: `Transcript: ${transcript}\nInstruction: ${prompt}` }
      ] }
    ]
  };
  try {
    const response = await axios.post(url, payload);
    // Adjust this based on Gemini's actual response structure
    return response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No summary generated.';
  } catch (err) {
    throw new Error('Gemini API error: ' + err.message);
  }
}
