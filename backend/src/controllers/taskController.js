const Task = require('../models/Task');
const User = require('../models/User');
const Project = require('../models/Project');
const { validationResult } = require('express-validator');

const updateUserTaskAssignment = async (taskId, userId) => {
  if (!userId) return;
  await User.findByIdAndUpdate(userId, { $addToSet: { assignedTasks: taskId } });
};

const removeUserTaskAssignment = async (taskId, userId) => {
  if (!userId) return;
  await User.findByIdAndUpdate(userId, { $pull: { assignedTasks: taskId } });
};

const ensureOverdueTasks = async (query = {}) => {
  const now = new Date();
  await Task.updateMany(
    { ...query, dueDate: { $lt: now }, status: { $nin: ['completed', 'overdue'] } },
    { status: 'overdue' }
  );
};

exports.createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    let { title, description, priority, dueDate, assignedTo, project, status } = req.body;

    if (req.user.role === 'member') {
      assignedTo = req.user._id;
    }
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(400).json({
        success: false,
        message: 'Project not found'
      });
    }

    const assignedMember = await User.findOne({ _id: assignedTo, role: 'member' });
    if (!assignedMember) {
      return res.status(400).json({
        success: false,
        message: 'Assigned user must be an existing member'
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description,
      priority: priority || 'medium',
      dueDate,
      assignedTo,
      project,
      status: status || 'pending',
      createdBy: req.user._id
    });

    if (assignedTo) {
      await updateUserTaskAssignment(task._id, assignedTo);
    }

    if (projectExists && assignedTo) {
      await User.findByIdAndUpdate(assignedTo, { $addToSet: { assignedProjects: project } });
    }

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('project', 'name')
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: populatedTask
    });
  } catch (error) {
    const isProduction = process.env.NODE_ENV === 'production';
    res.status(500).json({
      success: false,
      message: 'Server error creating task',
      ...(isProduction ? {} : { error: error.message })
    });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'member') {
      query.assignedTo = req.user._id;
    }

    if (req.query.status) query.status = req.query.status;
    if (req.query.priority) query.priority = req.query.priority;
    if (req.query.project) query.project = req.query.project;

    // Prevent members from querying other assignees' tasks.
    if (req.user.role === 'admin' && req.query.assignedTo) {
      query.assignedTo = req.query.assignedTo;
    }

    await ensureOverdueTasks(query);

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email status')
      .populate('project', 'name status')
      .populate('createdBy', 'name email')
      .sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    const isProduction = process.env.NODE_ENV === 'production';
    res.status(500).json({
      success: false,
      message: 'Server error fetching tasks',
      ...(isProduction ? {} : { error: error.message })
    });
  }
};

exports.getTasksByProject = async (req, res) => {
  try {
    const query = { project: req.params.projectId };

    if (req.user.role === 'member') {
      query.assignedTo = req.user._id;
    }

    await ensureOverdueTasks(query);

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email status')
      .populate('project', 'name status')
      .sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    const isProduction = process.env.NODE_ENV === 'production';
    res.status(500).json({
      success: false,
      message: 'Server error fetching tasks',
      ...(isProduction ? {} : { error: error.message })
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    if (req.user.role === 'member') {
      if (!task.assignedTo || task.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only update your assigned tasks.'
        });
      }
    }

    const previousAssignedTo = task.assignedTo?.toString();
    if (req.user.role === 'member') {
      delete req.body.assignedTo;
    }

    if (req.body.assignedTo) {
      const assignedMember = await User.findOne({ _id: req.body.assignedTo, role: 'member' });
      if (!assignedMember) {
        return res.status(400).json({
          success: false,
          message: 'Assigned user must be an existing member'
        });
      }
    }

    const taskUpdates = {
      ...req.body,
      title: req.body.title ? req.body.title.trim() : task.title
    };

    task = await Task.findByIdAndUpdate(
      req.params.id,
      taskUpdates,
      { new: true, runValidators: true }
    )
      .populate('assignedTo', 'name email status')
      .populate('project', 'name status')
      .populate('createdBy', 'name email');

    if (req.body.assignedTo && req.body.assignedTo !== previousAssignedTo) {
      await removeUserTaskAssignment(task._id, previousAssignedTo);
      await updateUserTaskAssignment(task._id, req.body.assignedTo);
    }

    if (task.dueDate < new Date() && task.status !== 'completed') {
      task.status = 'overdue';
      await task.save();
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error updating task',
      ...(process.env.NODE_ENV === 'production' ? {} : { error: error.message })
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await removeUserTaskAssignment(task._id, task.assignedTo?.toString());
    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error deleting task',
      ...(process.env.NODE_ENV === 'production' ? {} : { error: error.message })
    });
  }
};
