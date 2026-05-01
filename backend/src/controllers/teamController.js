const User = require('../models/User');
const Task = require('../models/Task');
const Project = require('../models/Project');
const { validationResult } = require('express-validator');

exports.getTeamMembers = async (req, res) => {
  try {
    const { search, role, status } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) query.role = role;
    if (status) query.status = status;

    const members = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    const membersWithCounts = await Promise.all(
      members.map(async (member) => {
        const taskCount = await Task.countDocuments({ assignedTo: member._id });
        const projectCount = await Project.countDocuments({ teamMembers: member._id });

        return {
          ...member.toObject(),
          taskCount,
          projectCount
        };
      })
    );

    res.status(200).json({
      success: true,
      count: membersWithCounts.length,
      data: membersWithCounts
    });
  } catch (error) {
    const isProduction = process.env.NODE_ENV === 'production';
    res.status(500).json({
      success: false,
      message: 'Server error fetching team members',
      ...(isProduction ? {} : { error: error.message })
    });
  }
};

exports.getTeamMember = async (req, res) => {
  try {
    const member = await User.findById(req.params.id)
      .select('-password')
      .populate('assignedProjects', 'name status deadline')
      .populate('assignedTasks', 'title status dueDate');

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error fetching team member',
      ...(process.env.NODE_ENV === 'production' ? {} : { error: error.message })
    });
  }
};

exports.createTeamMember = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password, role, status } = req.body;
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    const member = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: role || 'member',
      status: status || 'active'
    });

    res.status(201).json({
      success: true,
      message: 'Team member created successfully',
      data: {
        id: member._id,
        name: member.name,
        email: member.email,
        role: member.role,
        status: member.status
      }
    });
  } catch (error) {
    const isProduction = process.env.NODE_ENV === 'production';
    res.status(500).json({
      success: false,
      message: 'Server error creating team member',
      ...(isProduction ? {} : { error: error.message })
    });
  }
};

exports.updateTeamMember = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, role, status } = req.body;
    const updates = {};

    if (name) updates.name = name.trim();
    if (email) updates.email = email.toLowerCase().trim();
    if (role) updates.role = role;
    if (status) updates.status = status;

    const member = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Team member updated successfully',
      data: member
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate email address'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error updating team member',
      ...(process.env.NODE_ENV === 'production' ? {} : { error: error.message })
    });
  }
};

exports.deleteTeamMember = async (req, res) => {
  try {
    const member = await User.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    await Project.updateMany(
      { teamMembers: member._id },
      { $pull: { teamMembers: member._id } }
    );

    await Task.updateMany(
      { assignedTo: member._id },
      { $unset: { assignedTo: '' } }
    );

    await User.deleteOne({ _id: member._id });

    res.status(200).json({
      success: true,
      message: 'Team member removed successfully'
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error removing team member',
      ...(process.env.NODE_ENV === 'production' ? {} : { error: error.message })
    });
  }
};
