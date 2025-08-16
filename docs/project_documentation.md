# AI Notes: Project Documentation

## Overview
AI Notes is a full-stack web application that allows users to paste meeting transcripts, provide custom prompts, and generate structured, shareable summaries using AI. The app also provides a history of all previous summaries and supports sharing via email.

---

## Approach

1. **User Experience First**: The UI is designed to be clean, modern, and intuitive, with a focus on accessibility and ease of use. Users can quickly upload transcripts, generate summaries, and view or share past notes.
2. **AI-Powered Summarization**: The backend leverages a generative AI model (Google Gemini API) to process transcripts and prompts, returning concise, context-aware summaries.
3. **Persistence & History**: All summaries are stored in a MongoDB database, allowing users to view, manage, and delete previous notes.
4. **Separation of Concerns**: The frontend and backend are decoupled, allowing for independent deployment and scaling.
5. **Security**: Sensitive credentials are managed via environment variables and never committed to source control. CORS and other best practices are followed.

---

## Process

1. **Frontend (React):**
   - Users paste a transcript and enter a custom prompt.
   - On clicking "Generate Summary", the frontend sends a POST request to the backend API.
   - The summary is displayed with live Markdown preview and can be edited or shared.
   - A summary history panel allows users to view all previous summaries.

2. **Backend (Node.js/Express):**
   - Receives transcript and prompt, calls the Gemini API for summarization.
   - Stores summaries in MongoDB with timestamps.
   - Provides RESTful endpoints for CRUD operations on summaries and for sharing via email.
   - Handles CORS and environment configuration for secure deployment.

3. **Deployment:**
   - **Frontend** is deployed on Vercel for global CDN delivery and fast static hosting.
   - **Backend** is deployed on Render as a web service, with environment variables for secrets and database URIs.
   - **MongoDB Atlas** is used for managed, scalable database hosting.

---

## Tech Stack

- **Frontend:**
  - React (with hooks)
  - React Markdown (for rich summary formatting)
  - Lucide React (for icons)
  - CSS (custom, with glassmorphism and dark mode)

- **Backend:**
  - Node.js
  - Express.js
  - Mongoose (MongoDB ODM)
  - Google Gemini API (AI summarization)
  - Nodemailer (for email sharing)
  - CORS, dotenv

- **Database:**
  - MongoDB Atlas (cloud-hosted, managed)

- **Deployment:**
  - Vercel (frontend)
  - Render (backend)

---

## Key Features
- Paste or upload meeting transcripts
- Custom prompt for tailored summaries
- AI-powered, context-aware summarization
- Edit and live-preview summaries in Markdown
- View and manage summary history
- Share summaries via email
- Responsive, modern UI

---

## Future Improvements
- User authentication and private summary storage
- File upload (audio, video, PDF)
- More AI models and summarization options
- Team collaboration features
- Advanced search and filtering in history

---

## Author
Rakshit Yadav

---

For more details, see the code and comments in each module.
