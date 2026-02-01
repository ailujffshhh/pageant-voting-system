const express = require('express');
const { body, validationResult } = require('express-validator');
const Candidate = require('../models/Candidate');
const Event = require('../models/Event');
const { auth, checkRole } = require('../middleware/auth');

const router = express.Router();

// @route   GET api/candidates
// @desc    Get all candidates
// @access  Public
router.get('/', auth, async (req, res) => {
  try {
    const { eventId } = req.query;
    
    let query = {};
    if (eventId) {
      query.eventId = eventId;
    }
    
    const candidates = await Candidate.find(query).populate('eventId', ['name', 'date']);
    res.json(candidates);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/candidates/:id
// @desc    Get candidate by ID
// @access  Public
router.get('/:id', auth, async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id).populate('eventId', ['name', 'date']);

    if (!candidate) {
      return res.status(404).json({ msg: 'Candidate not found' });
    }

    res.json(candidate);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Candidate not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/candidates
// @desc    Create a new candidate (admin only)
// @access  Private - Admin
router.post('/', 
  [
    auth, 
    checkRole(['admin']),
    body('name', 'Candidate name is required').not().isEmpty(),
    body('number', 'Candidate number is required').not().isEmpty(),
    body('eventId', 'Event ID is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, number, eventId } = req.body;

    try {
      // Verify event exists
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(400).json({ errors: [{ msg: 'Event does not exist' }] });
      }

      const newCandidate = new Candidate({
        name,
        number,
        eventId
      });

      const candidate = await newCandidate.save();
      res.json(candidate);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/candidates/:id
// @desc    Update candidate (admin only)
// @access  Private - Admin
router.put('/:id', 
  [
    auth, 
    checkRole(['admin']),
    body('name', 'Candidate name is required').optional().not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const candidateFields = {};
      if (req.body.name) candidateFields.name = req.body.name;
      if (req.body.number) candidateFields.number = req.body.number;
      if (req.body.eventId) candidateFields.eventId = req.body.eventId;
      if (req.body.isActive !== undefined) candidateFields.isActive = req.body.isActive;

      const candidate = await Candidate.findByIdAndUpdate(
        req.params.id,
        { $set: candidateFields },
        { new: true }
      ).populate('eventId', ['name', 'date']);

      if (!candidate) {
        return res.status(404).json({ msg: 'Candidate not found' });
      }

      res.json(candidate);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Candidate not found' });
      }
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/candidates/:id
// @desc    Delete candidate (admin only)
// @access  Private - Admin
router.delete('/:id', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndRemove(req.params.id);

    if (!candidate) {
      return res.status(404).json({ msg: 'Candidate not found' });
    }

    res.json({ msg: 'Candidate removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Candidate not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;