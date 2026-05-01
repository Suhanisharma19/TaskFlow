const mongoose = require('mongoose');

/**
 * Project Schema
 * Stores project information with team members and deadlines
 */
const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: [100, 'Project name cannot exceed 100 characters']
  },
  normalizedName: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  deadline: {
    type: Date,
    required: [true, 'Project deadline is required']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'delayed'],
    default: 'active'
  },
  teamMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

/**
 * Virtual field: Calculate project progress based on tasks
 */
projectSchema.virtual('progress', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project',
  count: true
});

/**
 * Index for faster queries
 */
projectSchema.index({ createdBy: 1, teamMembers: 1 });

projectSchema.pre('validate', function setNormalizedName(next) {
  if (this.name) {
    this.normalizedName = this.name.trim().toLowerCase();
  }
  next();
});

module.exports = mongoose.model('Project', projectSchema);
