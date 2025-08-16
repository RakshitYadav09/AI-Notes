import React, { useState } from "react";
import { Send, Edit3, Save, FileText, Mail } from "lucide-react";

const API = "http://localhost:5000/api";

export default function App() {
  const [transcript, setTranscript] = useState("");
  const [prompt, setPrompt] = useState("");
  const [summary, setSummary] = useState("");
  const [summaryId, setSummaryId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [recipients, setRecipients] = useState("");
  const [emailStatus, setEmailStatus] = useState("");

  const handleSummarize = async () => {
    setLoading(true);
    setSummary("");
    setSummaryId(null);
    setEditMode(false);
    setEmailStatus("");
    try {
      const res = await fetch(`${API}/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, prompt })
      });
      const data = await res.json();
      setSummary(data.summary || "");
      setSummaryId(data.id || null);
      setEditMode(true);
    } catch (e) {
      setSummary("Error generating summary.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!summaryId) return;
    setLoading(true);
    setEmailStatus("");
    try {
      const res = await fetch(`${API}/summaries/${summaryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary })
      });
      if (res.ok) {
        setEditMode(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    setLoading(true);
    setEmailStatus("");
    try {
      const res = await fetch(`${API}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          summary, 
          recipients: recipients.split(",").map(e => e.trim()).filter(Boolean) 
        })
      });
      const data = await res.json();
      setEmailStatus(data.message || data.error || "");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <div className="app-title">
          <h1>AI Meeting Notes Summarizer</h1>
          <p>Transform your meeting transcripts into structured summaries</p>
        </div>
        
        <div className="glass-card">
          <div className="card-header">
            <div className="card-title">
              <FileText size={20} />
              1. Upload Transcript
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="transcript" className="form-label">
              Paste your transcript here
            </label>
            <textarea
              id="transcript"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Paste or type meeting transcript..."
              className="form-textarea"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="prompt" className="form-label">
              Custom Instruction
            </label>
            <input
              id="prompt"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Summarize in bullet points for executives"
              className="form-input"
            />
          </div>
          
          <div className="card-footer">
            <button 
              onClick={handleSummarize} 
              disabled={loading || !transcript || !prompt}
              className="btn btn-primary btn-full"
            >
              {loading ? (
                <>
                  <div className="spinner" style={{width: '16px', height: '16px', border: '2px solid #ffffff', borderTop: '2px solid transparent', borderRadius: '50%'}}></div>
                  Generating...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Generate Summary
                </>
              )}
            </button>
          </div>
        </div>

        {summary && (
          <div className="glass-card">
            <div className="card-header">
              <div className="card-title">
                <FileText size={20} />
                2. Generated Summary
              </div>
            </div>
            {editMode ? (
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="form-textarea"
                style={{minHeight: '200px'}}
              />
            ) : (
              <div 
                className="summary-display"
                dangerouslySetInnerHTML={{
                  __html: summary
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n\n/g, '</p><p>')
                    .replace(/^(.+)$/gm, '<p>$1</p>')
                    .replace(/(<p>.*?:)(<\/p>)/g, '<h3>$1</h3>')
                }}
              />
            )}
            <div className="card-footer">
              {editMode ? (
                <button 
                  onClick={handleUpdate} 
                  disabled={loading}
                  className="btn btn-success"
                >
                  <Save size={16} />
                  Save Changes
                </button>
              ) : (
                <button 
                  onClick={() => setEditMode(true)}
                  className="btn btn-outline"
                >
                  <Edit3 size={16} />
                  Edit Summary
                </button>
              )}
            </div>
          </div>
        )}

        {summary && !editMode && (
          <div className="glass-card">
            <div className="card-header">
              <div className="card-title">
                <Mail size={20} />
                3. Share via Email
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="recipients" className="form-label">
                Recipient Emails (comma separated)
              </label>
              <input
                id="recipients"
                type="text"
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                placeholder="e.g. alice@example.com, bob@example.com"
                className="form-input"
              />
            </div>
            
            {emailStatus && (
              <div className={`alert ${emailStatus.includes('success') ? 'alert-success' : 'alert-error'}`}>
                {emailStatus}
              </div>
            )}
            
            <div className="card-footer">
              <button 
                onClick={handleShare} 
                disabled={loading || !recipients}
                className="btn btn-share btn-full"
              >
                {loading ? (
                  <>
                    <div className="spinner" style={{width: '16px', height: '16px', border: '2px solid #ffffff', borderTop: '2px solid transparent', borderRadius: '50%'}}></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail size={16} />
                    Share Summary
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
