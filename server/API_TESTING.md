# API Testing Guide

## 1. Summarize Endpoint
POST http://localhost:5000/api/summarize

**Body (JSON):**
{
  "transcript": "Your meeting transcript here.",
  "prompt": "Summarize in bullet points."
}

**Example curl:**
curl -X POST http://localhost:5000/api/summarize -H "Content-Type: application/json" -d '{"transcript":"Your meeting transcript here.","prompt":"Summarize in bullet points."}'

---

## 2. Update Summary
PUT http://localhost:5000/api/summaries/:id

**Body (JSON):**
{
  "summary": "Edited summary text."
}

**Example curl:**
curl -X PUT http://localhost:5000/api/summaries/<SUMMARY_ID> -H "Content-Type: application/json" -d '{"summary":"Edited summary text."}'

---

## 3. Share via Email
POST http://localhost:5000/api/share

**Body (JSON):**
{
  "summary": "The summary to share.",
  "recipients": ["recipient1@example.com", "recipient2@example.com"]
}

**Example curl:**
curl -X POST http://localhost:5000/api/share -H "Content-Type: application/json" -d '{"summary":"The summary to share.","recipients":["recipient1@example.com"]}'

---

## Notes
- The backend must be running (`node index.js` in the `server/` directory).
- You must set up your email credentials in `.env` to test the email endpoint.
- All endpoints return JSON.
