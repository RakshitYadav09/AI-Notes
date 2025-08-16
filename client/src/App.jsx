import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import HistoryIcon from "@mui/icons-material/History";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import SendIcon from "@mui/icons-material/Send";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

const API = "https://ai-notes-p30j.onrender.com/api";

function Panel({ title, children }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        mb: 3,
        background: "#111",
        border: "1px solid #222",
        color: "#fff",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, color: "#fff" }}>
        {title}
      </Typography>
      {children}
    </Paper>
  );
}

export default function App() {
  const [transcript, setTranscript] = useState("");
  const [prompt, setPrompt] = useState("");
  const [summary, setSummary] = useState("");
  const [summaryId, setSummaryId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [recipients, setRecipients] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [currentView, setCurrentView] = useState("main"); // "main" or "summaries"
  const [summaries, setSummaries] = useState([]);

  // Fetch previous summaries on mount
  useEffect(() => {
    fetch(`${API}/summaries`)
      .then(res => res.json())
      .then(data => setSummaries(Array.isArray(data) ? data.reverse() : []))
      .catch(err => console.error('Error fetching summaries:', err));
  }, []);

  // Delete a summary (optional, for better UX)
  const handleDeleteSummary = async (id) => {
    try {
      await fetch(`${API}/summaries/${id}`, { method: "DELETE" });
      setSummaries(summaries.filter(s => s._id !== id));
    } catch (err) {
      console.error('Error deleting summary:', err);
    }
  };

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
        body: JSON.stringify({ transcript, prompt }),
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
    try {
      const res = await fetch(`${API}/summaries/${summaryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary }),
      });
      if (res.ok) setEditMode(false);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summary,
          recipients: recipients.split(",").map((r) => r.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      setEmailStatus(data.message || data.error || "");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6, minHeight: "100vh" }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: "#fff" }}>
          AI Meeting Notes
        </Typography>
        <Typography sx={{ color: "#bbb", mb: 3 }}>
          Paste transcript, give a prompt, generate a concise summary.
        </Typography>
        
        {/* Prominent View Summaries Button */}
        <Button
          variant="contained"
          size="large"
          startIcon={<HistoryIcon sx={{ fontSize: 20 }} />}
          onClick={() => setCurrentView("summaries")}
          sx={{
            textTransform: "none",
            background: "#2196f3",
            color: "#fff",
            fontWeight: 600,
            py: 1.5,
            px: 4,
            borderRadius: 2,
            "&:hover": { 
              background: "#1976d2",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(33, 150, 243, 0.3)"
            },
            mb: 2,
          }}
        >
          View All Chats & Summaries ({summaries.length})
        </Button>
      </Box>

      {currentView === "summaries" ? (
        // Full Previous Summaries Page
        <>
          <Box sx={{ mb: 3, textAlign: "center" }}>
            <Typography variant="h5" sx={{ color: "#fff", mb: 3, fontWeight: 600 }}>
              All Previous Chats & Summaries
            </Typography>
            <Button
              variant="outlined"
              size="large"
              startIcon={<ArrowBackIcon sx={{ fontSize: 20 }} />}
              onClick={() => setCurrentView("main")}
              sx={{
                textTransform: "none",
                borderColor: "#2196f3",
                color: "#2196f3",
                fontWeight: 600,
                py: 1,
                px: 3,
                "&:hover": { 
                  background: "rgba(33, 150, 243, 0.1)",
                  borderColor: "#1976d2",
                  color: "#1976d2"
                },
              }}
            >
              Back to Create New Summary
            </Button>
          </Box>
          <Panel title={`${summaries.length} Previous Summaries`}>
            {summaries.length === 0 ? (
              <Typography sx={{ color: '#888', fontSize: '1rem', textAlign: 'center', py: 4 }}>
                No previous summaries yet. Create your first summary by going back to the main page!
              </Typography>
            ) : (
              <List dense disablePadding sx={{ width: '100%', bgcolor: 'transparent' }}>
                {summaries.map((s, idx) => (
                  <React.Fragment key={s._id}>
                    <ListItem
                      alignItems="flex-start"
                      secondaryAction={
                        <IconButton 
                          edge="end" 
                          aria-label="delete" 
                          onClick={() => handleDeleteSummary(s._id)}
                          sx={{ 
                            color: '#ff4444',
                            "&:hover": { background: "rgba(255, 68, 68, 0.1)" }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                      sx={{ px: 0, py: 2, "&:hover": { background: "rgba(255,255,255,0.02)" } }}
                    >
                      <ListItemText
                        primary={
                          <Typography sx={{ color: '#fff', fontWeight: 500, fontSize: '1.1rem', mb: 1 }}>
                            {s.summary?.slice(0, 100) || 'Untitled summary'}{s.summary && s.summary.length > 100 ? '...' : ''}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" sx={{ color: '#2196f3', fontSize: '0.9rem', fontWeight: 500 }}>
                              📅 {new Date(s.createdAt).toLocaleString()}
                            </Typography>
                            {s.summary && s.summary.length > 100 && (
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: '#ccc', 
                                  fontSize: '0.9rem', 
                                  mt: 1, 
                                  whiteSpace: 'pre-wrap',
                                  lineHeight: 1.6
                                }}
                              >
                                {s.summary}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                    {idx < summaries.length - 1 && <Divider sx={{ bgcolor: '#333', my: 1 }} />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Panel>
        </>
      ) : (
        // Main Page with form inputs
        <>
          <Panel title="1. Transcript">
            <TextField
              multiline
              minRows={6}
              fullWidth
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Paste or type meeting transcript..."
              variant="outlined"
              InputProps={{
                sx: {
                  backgroundColor: "#111",
                  color: "#fff",
                  fontFamily: "Inter, monospace",
                },
              }}
            />
          </Panel>

      <Panel title="2. Prompt">
        <TextField
          fullWidth
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Summarize in bullet points for executives"
          variant="outlined"
          InputProps={{
            sx: {
              backgroundColor: "#111",
              color: "#fff",
              fontFamily: "Inter, monospace",
            },
          }}
        />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<SendIcon sx={{ fontSize: 18, color: "#000" }} />}
            onClick={handleSummarize}
            disabled={loading || !transcript || !prompt}
            sx={{
              textTransform: "none",
              px: 2.5,
              background: "#fff",
              color: "#000",
              "&:hover": { background: "#eee" },
            }}
          >
            Generate
          </Button>
          {loading && <CircularProgress size={24} sx={{ alignSelf: "center", color: "#fff" }} />}
        </Stack>
      </Panel>

      {summary && (
        <Panel title="3. Summary">
          {editMode ? (
            <TextField
              multiline
              minRows={8}
              fullWidth
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              InputProps={{
                sx: {
                  fontFamily: "Inter, monospace",
                  fontSize: "0.98rem",
                  background: "#111",
                  color: "#fff",
                },
              }}
            />
          ) : (
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                mb: 2,
                backgroundColor: "#000",
                borderColor: "#222",
              }}
            >
              <Typography
                sx={{
                  whiteSpace: "pre-wrap",
                  color: "#fff",
                  fontFamily: "Inter, monospace",
                }}
              >
                {summary}
              </Typography>
            </Paper>
          )}

          <Stack direction="row" spacing={2}>
            {editMode ? (
              <Button
                variant="contained"
                startIcon={<SaveIcon sx={{ fontSize: 18, color: "#000" }} />}
                onClick={handleUpdate}
                disabled={loading}
                sx={{
                  textTransform: "none",
                  background: "#fff",
                  color: "#000",
                  "&:hover": { background: "#eee" },
                }}
              >
                Save
              </Button>
            ) : (
              <Button
                variant="outlined"
                startIcon={<EditIcon sx={{ fontSize: 18, color: "#fff" }} />}
                onClick={() => setEditMode(true)}
                sx={{
                  textTransform: "none",
                  borderColor: "#fff",
                  color: "#fff",
                  "&:hover": { background: "#222" },
                }}
              >
                Edit
              </Button>
            )}
          </Stack>
        </Panel>
      )}

      {summary && !editMode && (
        <Panel title="4. Share">
          <TextField
            fullWidth
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
            placeholder="alice@example.com, bob@example.com"
            variant="outlined"
            InputProps={{
              sx: {
                backgroundColor: "#111",
                color: "#fff",
                fontFamily: "Inter, monospace",
              },
            }}
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<MailOutlineIcon sx={{ fontSize: 18, color: "#000" }} />}
              onClick={handleShare}
              disabled={loading || !recipients}
              sx={{
                textTransform: "none",
                background: "#fff",
                color: "#000",
                "&:hover": { background: "#eee" },
              }}
            >
              Share
            </Button>
            {emailStatus && (
              <Typography sx={{ alignSelf: "center", color: "#fff" }}>
                {emailStatus}
              </Typography>
            )}
          </Stack>
        </Panel>
      )}
        </>
      )}
    </Container>
  );
}