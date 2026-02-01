const express = require('express');
const { body, validationResult } = require('express-validator');
const Vote = require('../models/Vote');
const Candidate = require('../models/Candidate');
const Event = require('../models/Event');
const User = require('../models/User');
const { auth, checkRole } = require('../middleware/auth');

const router = express.Router();

// @route   GET api/votes
// @desc    Get all votes (admin only)
// @access  Private - Admin
router.get('/', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const { eventId, judgeId, candidateId } = req.query;
    
    let query = {};
    if (eventId) query.event = eventId;
    if (judgeId) query.judge = judgeId;
    if (candidateId) query.candidate = candidateId;
    
    const votes = await Vote.find(query)
      .populate('candidate', ['name', 'number'])
      .populate('event', ['name', 'date'])
      .populate('judge', ['name', 'email']);
    
    res.json(votes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/votes/:id
// @desc    Get vote by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const vote = await Vote.findById(req.params.id)
      .populate('candidate', ['name', 'number'])
      .populate('event', ['name', 'date'])
      .populate('judge', ['name', 'email']);

    if (!vote) {
      return res.status(404).json({ msg: 'Vote not found' });
    }

    // Allow judge to see their own vote, admins to see any
    if (req.user.role !== 'admin' && vote.judge._id.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    res.json(vote);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Vote not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/votes
// @desc    Submit votes (judge only)
// @access  Private - Judge
router.post('/', 
  [
    auth, 
    checkRole(['judge']),
    body('votes').isArray({ min: 1 }),
    body('votes.*.candidate', 'Candidate ID is required').not().isEmpty(),
    body('votes.*.event', 'Event ID is required').not().isEmpty(),
    body('votes.*.score', 'Score is required and must be between 0 and 10').isFloat({ min: 0, max: 10 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { votes } = req.body;

    try {
      // Validate that the judge doesn't vote multiple times for the same candidate in the same event
      const candidateIds = votes.map(v => v.candidate);
      const eventIds = votes.map(v => v.event);
      
      // Check if judge already voted for any of these candidates in this event
      for (const voteData of votes) {
        const existingVote = await Vote.findOne({
          candidate: voteData.candidate,
          event: voteData.event,
          judge: req.user.id
        });
        
        if (existingVote) {
          return res.status(400).json({ 
            errors: [{ 
              msg: `You have already voted for candidate ${voteData.candidate} in this event` 
            }] 
          });
        }
      }

      // Verify all candidates, events, and that they match
      for (const voteData of votes) {
        const [candidate, event] = await Promise.all([
          Candidate.findById(voteData.candidate),
          Event.findById(voteData.event)
        ]);

        if (!candidate || !event) {
          return res.status(400).json({ 
            errors: [{ msg: 'Invalid candidate or event ID' }] 
          });
        }

        // Verify the candidate belongs to the specified event
        if (candidate.eventId.toString() !== voteData.event) {
          return res.status(400).json({ 
            errors: [{ msg: 'Candidate does not belong to the specified event' }] 
          });
        }
      }

      // Create all votes
      const createdVotes = [];
      for (const voteData of votes) {
        const newVote = new Vote({
          candidate: voteData.candidate,
          event: voteData.event,
          judge: req.user.id, // Use the authenticated user's ID
          score: voteData.score
        });

        const savedVote = await newVote.save();
        createdVotes.push(savedVote);
      }

      res.json(createdVotes);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/votes/:id
// @desc    Update vote (judge only, for their own vote)
// @access  Private - Judge
router.put('/:id', 
  [
    auth, 
    checkRole(['judge']),
    body('score', 'Score must be between 0 and 10').isFloat({ min: 0, max: 10 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Check if vote exists and belongs to the current user
      const vote = await Vote.findById(req.params.id);
      if (!vote) {
        return res.status(404).json({ msg: 'Vote not found' });
      }

      if (vote.judge.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied' });
      }

      // Update the vote
      const updatedVote = await Vote.findByIdAndUpdate(
        req.params.id,
        { $set: { score: req.body.score } },
        { new: true }
      ).populate('candidate', ['name', 'number'])
        .populate('event', ['name', 'date'])
        .populate('judge', ['name', 'email']);

      res.json(updatedVote);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Vote not found' });
      }
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/votes/:id
// @desc    Delete vote (admin only)
// @access  Private - Admin
router.delete('/:id', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const vote = await Vote.findByIdAndRemove(req.params.id);

    if (!vote) {
      return res.status(404).json({ msg: 'Vote not found' });
    }

    res.json({ msg: 'Vote removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Vote not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;