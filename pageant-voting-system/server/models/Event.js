const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  judges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  candidates: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', EventSchema);