import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Card,
  CardContent,
  Grid,
  Button,
  Box,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';

const JudgeVote = () => {
  const [events, setEvents] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [votes, setVotes] = useState({});
  const [currentEvent, setCurrentEvent] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Load events and candidates on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch events
        const eventsRes = await axios.get('http://localhost:5000/api/events', { headers });
        setEvents(eventsRes.data);

        // Set first event as current if available
        if (eventsRes.data.length > 0) {
          setCurrentEvent(eventsRes.data[0]._id);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchData();
  }, []);

  // Load candidates when event changes
  useEffect(() => {
    const fetchCandidates = async () => {
      if (!currentEvent) return;

      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const candidatesRes = await axios.get(
          `http://localhost:5000/api/candidates?eventId=${currentEvent}`, 
          { headers }
        );
        setCandidates(candidatesRes.data);

        // Initialize votes state
        const initialVotes = {};
        candidatesRes.data.forEach(candidate => {
          initialVotes[candidate._id] = { score: 0 };
        });
        setVotes(initialVotes);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      }
    };

    fetchCandidates();
  }, [currentEvent]);

  const handleRatingChange = (candidateId, newValue) => {
    setVotes(prev => ({
      ...prev,
      [candidateId]: { ...prev[candidateId], score: newValue }
    }));
  };

  const handleEventChange = (eventId) => {
    setCurrentEvent(eventId);
  };

  const handleSubmitVotes = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

      // Prepare vote data
      const voteData = [];
      candidates.forEach(candidate => {
        if (votes[candidate._id]?.score > 0) {
          voteData.push({
            candidate: candidate._id,
            event: currentEvent,
            score: votes[candidate._id].score
          });
        }
      });

      // Submit votes
      await axios.post('http://localhost:5000/api/votes', { votes: voteData }, { headers });

      setSuccessMessage('Votes submitted successfully!');
      setShowConfirmation(false);
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error submitting votes:', error);
      setErrorMessage('Failed to submit votes. Please try again.');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Judge Voting Panel
          </Typography>
          <Button color="inherit" onClick={() => localStorage.removeItem('token') && window.location.replace('/')}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>
        )}
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>
        )}

        <Typography variant="h4" gutterBottom>
          Pageant Voting System
        </Typography>

        {/* Event Selection */}
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Select Event:
          </Typography>
          <Grid container spacing={2}>
            {events.map(event => (
              <Button
                key={event._id}
                variant={currentEvent === event._id ? 'contained' : 'outlined'}
                onClick={() => handleEventChange(event._id)}
                sx={{ mr: 1, mb: 1 }}
              >
                {event.name}
              </Button>
            ))}
          </Grid>
        </Box>

        {candidates.length > 0 ? (
          <>
            <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
              Rate Candidates (Event: {events.find(e => e._id === currentEvent)?.name})
            </Typography>
            
            <Grid container spacing={3}>
              {candidates.map(candidate => (
                <Grid item xs={12} sm={6} md={4} key={candidate._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        #{candidate.number}: {candidate.name}
                      </Typography>
                      
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="body1">Score:</Typography>
                        <Rating
                          name={`rating-${candidate._id}`}
                          value={votes[candidate._id]?.score || 0}
                          onChange={(event, newValue) => handleRatingChange(candidate._id, newValue)}
                          precision={0.5}
                          size="large"
                        />
                      </Box>
                      
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        Current Score: {votes[candidate._id]?.score || 0}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box mt={3} textAlign="center">
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => setShowConfirmation(true)}
                disabled={Object.keys(votes).length === 0}
              >
                Submit Votes
              </Button>
            </Box>
          </>
        ) : (
          <Box textAlign="center" mt={5}>
            <Typography variant="h6" color="textSecondary">
              {currentEvent ? 'No candidates registered for this event yet.' : 'Please select an event first.'}
            </Typography>
          </Box>
        )}
      </Container>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onClose={() => setShowConfirmation(false)}>
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>
          <Typography>
            You are about to submit your votes for the selected candidates. 
            Are you sure you want to submit these scores?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmation(false)}>Cancel</Button>
          <Button onClick={handleSubmitVotes} variant="contained" color="primary">
            Submit Votes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default JudgeVote;