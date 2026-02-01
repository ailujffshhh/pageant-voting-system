const express = require('express');
const { body, validationResult } = require('express-validator');
const Event = require('../models/Event');
const { auth, checkRole } = require('../middleware/auth');

const router = express.Router();

// @route   GET api/events
// @desc    Get all events
// @access  Public
router.get('/', auth, async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/events/:id
// @desc    Get event by ID
// @access  Public
router.get('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    res.json(event);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/events
// @desc    Create a new event (admin only)
// @access  Private - Admin
router.post('/', 
  [
    auth, 
    checkRole(['admin']),
    body('name', 'Event name is required').not().isEmpty(),
    body('date', 'Event date is required').not().isEmpty().toDate()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, date } = req.body;

    try {
      const newEvent = new Event({
        name,
        description,
        date
      });

      const event = await newEvent.save();
      res.json(event);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/events/:id
// @desc    Update event (admin only)
// @access  Private - Admin
router.put('/:id', 
  [
    auth, 
    checkRole(['admin']),
    body('name', 'Event name is required').optional().not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const eventFields = {};
      if (req.body.name) eventFields.name = req.body.name;
      if (req.body.description) eventFields.description = req.body.description;
      if (req.body.date) eventFields.date = req.body.date;
      if (req.body.isActive !== undefined) eventFields.isActive = req.body.isActive;

      const event = await Event.findByIdAndUpdate(
        req.params.id,
        { $set: eventFields },
        { new: true }
      );

      if (!event) {
        return res.status(404).json({ msg: 'Event not found' });
      }

      res.json(event);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Event not found' });
      }
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/events/:id
// @desc    Delete event (admin only)
// @access  Private - Admin
router.delete('/:id', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const event = await Event.findByIdAndRemove(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    res.json({ msg: 'Event removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;