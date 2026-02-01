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
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress
} from '@mui/material';

const Results = () => {
  const [events, setEvents] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [votes, setVotes] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const eventsRes = await axios.get('http://localhost:5000/api/events', { headers });
        setEvents(eventsRes.data);

        if (eventsRes.data.length > 0) {
          setSelectedEvent(eventsRes.data[0]._id);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  // Calculate results when event changes
  useEffect(() => {
    if (selectedEvent) {
      calculateResults();
    }
  }, [selectedEvent, votes]);

  const calculateResults = async () => {
    if (!selectedEvent) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch all data needed for results
      const [candidatesRes, votesRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/candidates?eventId=${selectedEvent}`, { headers }),
        axios.get(`http://localhost:5000/api/votes?eventId=${selectedEvent}`, { headers })
      ]);

      setCandidates(candidatesRes.data);
      setVotes(votesRes.data);

      // Calculate average scores for each candidate
      const candidateScores = {};

      // Initialize scores
      candidatesRes.data.forEach(candidate => {
        candidateScores[candidate._id] = {
          candidate: candidate,
          totalScore: 0,
          voteCount: 0,
          averageScore: 0
        };
      });

      // Aggregate scores
      votesRes.data.forEach(vote => {
        if (candidateScores[vote.candidate]) {
          candidateScores[vote.candidate].totalScore += vote.score;
          candidateScores[vote.candidate].voteCount += 1;
        }
      });

      // Calculate averages
      Object.keys(candidateScores).forEach(candidateId => {
        const candidateData = candidateScores[candidateId];
        if (candidateData.voteCount > 0) {
          candidateData.averageScore = parseFloat((candidateData.totalScore / candidateData.voteCount).toFixed(2));
        }
      });

      // Sort by average score (descending)
      const sortedResults = Object.values(candidateScores)
        .sort((a, b) => b.averageScore - a.averageScore);

      setResults(sortedResults);
    } catch (error) {
      console.error('Error calculating results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEventChange = (event) => {
    setSelectedEvent(event.target.value);
  };

  const getCurrentEventName = () => {
    const event = events.find(e => e._id === selectedEvent);
    return event ? event.name : '';
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Voting Results
          </Typography>
          <Button color="inherit" onClick={() => localStorage.removeItem('token') && window.location.replace('/')}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Pageant Results
        </Typography>

        {/* Event Selection */}
        <Box mb={3}>
          <FormControl fullWidth>
            <InputLabel>Select Event</InputLabel>
            <Select
              value={selectedEvent}
              label="Select Event"
              onChange={handleEventChange}
            >
              {events.map(event => (
                <MenuItem key={event._id} value={event._id}>
                  {event.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <CircularProgress />
          </Box>
        ) : (
          <>
            {selectedEvent && (
              <Typography variant="h5" gutterBottom sx={{ mt: 3, mb: 2 }}>
                Results for: {getCurrentEventName()}
              </Typography>
            )}

            {results.length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Rank</TableCell>
                      <TableCell>Candidate</TableCell>
                      <TableCell align="center">Number</TableCell>
                      <TableCell align="center">Average Score</TableCell>
                      <TableCell align="center">Total Score</TableCell>
                      <TableCell align="center">Votes Count</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {results.map((result, index) => (
                      <TableRow key={result.candidate._id} hover>
                        <TableCell>
                          <Chip 
                            label={index + 1} 
                            color={index === 0 ? 'primary' : index === 1 ? 'secondary' : 'default'} 
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <strong>{result.candidate.name}</strong>
                        </TableCell>
                        <TableCell align="center">
                          <Chip label={`#${result.candidate.number}`} size="small" />
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="h6" color="primary">
                            {result.averageScore.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          {result.totalScore.toFixed(2)}
                        </TableCell>
                        <TableCell align="center">
                          {result.voteCount}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              selectedEvent && (
                <Box textAlign="center" mt={5}>
                  <Typography variant="h6" color="textSecondary">
                    No votes recorded for this event yet.
                  </Typography>
                </Box>
              )
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default Results;