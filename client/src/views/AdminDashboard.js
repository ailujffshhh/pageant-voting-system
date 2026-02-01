import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Box,
  Container,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Event as EventIcon,
  People as PeopleIcon,
  Assignment as ResultsIcon,
  PersonAdd as AddUserIcon,
  Group as JudgesIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const drawerWidth = 240;

const AdminDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [judges, setJudges] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [showAddEventDialog, setShowAddEventDialog] = useState(false);
  const [showAddJudgeDialog, setShowAddJudgeDialog] = useState(false);
  const [showAddCandidateDialog, setShowAddCandidateDialog] = useState(false);
  const [eventForm, setEventForm] = useState({ name: '', description: '', date: '' });
  const [judgeForm, setJudgeForm] = useState({ name: '', email: '', password: '' });
  const [candidateForm, setCandidateForm] = useState({ name: '', number: '', eventId: '' });

  const navigate = useNavigate();

  // Load data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch events
      const eventsRes = await axios.get('http://localhost:5000/api/events', { headers });
      setEvents(eventsRes.data);

      // Fetch judges
      const judgesRes = await axios.get('http://localhost:5000/api/users?role=judge', { headers });
      setJudges(judgesRes.data);

      // Fetch candidates
      const candidatesRes = await axios.get('http://localhost:5000/api/candidates', { headers });
      setCandidates(candidatesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleAddEvent = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

      await axios.post('http://localhost:5000/api/events', eventForm, { headers });
      setShowAddEventDialog(false);
      setEventForm({ name: '', description: '', date: '' });
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleAddJudge = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

      await axios.post('http://localhost:5000/api/users', { ...judgeForm, role: 'judge' }, { headers });
      setShowAddJudgeDialog(false);
      setJudgeForm({ name: '', email: '', password: '' });
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error adding judge:', error);
    }
  };

  const handleAddCandidate = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

      await axios.post('http://localhost:5000/api/candidates', candidateForm, { headers });
      setShowAddCandidateDialog(false);
      setCandidateForm({ name: '', number: '', eventId: '' });
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error adding candidate:', error);
    }
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap>
          Admin Panel
        </Typography>
      </Toolbar>
      <List>
        <ListItem button component={Link} to="/admin/dashboard">
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/admin/events">
          <ListItemIcon><EventIcon /></ListItemIcon>
          <ListItemText primary="Events" />
        </ListItem>
        <ListItem button component={Link} to="/admin/judges">
          <ListItemIcon><PeopleIcon /></ListItemIcon>
          <ListItemText primary="Judges" />
        </ListItem>
        <ListItem button component={Link} to="/admin/candidates">
          <ListItemIcon><AddUserIcon /></ListItemIcon>
          <ListItemText primary="Candidates" />
        </ListItem>
        <ListItem button component={Link} to="/admin/results">
          <ListItemIcon><ResultsIcon /></ListItemIcon>
          <ListItemText primary="Results" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Pageant Voting System - Admin
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        {drawer}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: `${drawerWidth}px` }}>
        <Toolbar />
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">Events</Typography>
                  <Typography variant="h3">{events.length}</Typography>
                  <Button 
                    variant="outlined" 
                    onClick={() => setShowAddEventDialog(true)}
                    sx={{ mt: 2 }}
                  >
                    Add Event
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">Judges</Typography>
                  <Typography variant="h3">{judges.length}</Typography>
                  <Button 
                    variant="outlined" 
                    onClick={() => setShowAddJudgeDialog(true)}
                    sx={{ mt: 2 }}
                  >
                    Add Judge
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">Candidates</Typography>
                  <Typography variant="h3">{candidates.length}</Typography>
                  <Button 
                    variant="outlined" 
                    onClick={() => setShowAddCandidateDialog(true)}
                    sx={{ mt: 2 }}
                  >
                    Add Candidate
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box mt={4}>
            <Typography variant="h4" gutterBottom>Recent Events</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {events.slice(0, 5).map((event) => (
                    <TableRow key={event._id}>
                      <TableCell>{event.name}</TableCell>
                      <TableCell>{event.description}</TableCell>
                      <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Container>

        {/* Add Event Dialog */}
        <Dialog open={showAddEventDialog} onClose={() => setShowAddEventDialog(false)}>
          <DialogTitle>Add New Event</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Event Name"
              fullWidth
              value={eventForm.name}
              onChange={(e) => setEventForm({...eventForm, [e.target.name]: e.target.value})}
            />
            <TextField
              margin="dense"
              name="description"
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={eventForm.description}
              onChange={(e) => setEventForm({...eventForm, [e.target.name]: e.target.value})}
            />
            <TextField
              margin="dense"
              name="date"
              label="Event Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={eventForm.date}
              onChange={(e) => setEventForm({...eventForm, [e.target.name]: e.target.value})}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowAddEventDialog(false)}>Cancel</Button>
            <Button onClick={handleAddEvent}>Add Event</Button>
          </DialogActions>
        </Dialog>

        {/* Add Judge Dialog */}
        <Dialog open={showAddJudgeDialog} onClose={() => setShowAddJudgeDialog(false)}>
          <DialogTitle>Add New Judge</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Full Name"
              fullWidth
              value={judgeForm.name}
              onChange={(e) => setJudgeForm({...judgeForm, [e.target.name]: e.target.value})}
            />
            <TextField
              margin="dense"
              name="email"
              label="Email"
              fullWidth
              value={judgeForm.email}
              onChange={(e) => setJudgeForm({...judgeForm, [e.target.name]: e.target.value})}
            />
            <TextField
              margin="dense"
              name="password"
              label="Password"
              type="password"
              fullWidth
              value={judgeForm.password}
              onChange={(e) => setJudgeForm({...judgeForm, [e.target.name]: e.target.value})}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowAddJudgeDialog(false)}>Cancel</Button>
            <Button onClick={handleAddJudge}>Add Judge</Button>
          </DialogActions>
        </Dialog>

        {/* Add Candidate Dialog */}
        <Dialog open={showAddCandidateDialog} onClose={() => setShowAddCandidateDialog(false)}>
          <DialogTitle>Add New Candidate</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Candidate Name"
              fullWidth
              value={candidateForm.name}
              onChange={(e) => setCandidateForm({...candidateForm, [e.target.name]: e.target.value})}
            />
            <TextField
              margin="dense"
              name="number"
              label="Candidate Number"
              fullWidth
              value={candidateForm.number}
              onChange={(e) => setCandidateForm({...candidateForm, [e.target.name]: e.target.value})}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Event</InputLabel>
              <Select
                name="eventId"
                value={candidateForm.eventId}
                onChange={(e) => setCandidateForm({...candidateForm, [e.target.name]: e.target.value})}
              >
                {events.map((event) => (
                  <MenuItem key={event._id} value={event._id}>{event.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowAddCandidateDialog(false)}>Cancel</Button>
            <Button onClick={handleAddCandidate}>Add Candidate</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default AdminDashboard;