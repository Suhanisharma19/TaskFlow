const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');
const { validationResult } = require('express-validator');

const normalizeProjectName = (name) => name.trim().toLowerCase();

const getProjectProgress = async (projectId) => {
  const stats = await Task.aggregate([
    { $match: { project: projectId } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const totalTasks = stats.reduce((sum, stat) => sum + stat.count, 0);
  const completedTasks = stats.find(s => s._id === 'completed')?.count || 0;
  const overdueTasks = stats.find(s => s._id === 'overdue')?.count || 0;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return { totalTasks, completedTasks, overdueTasks, progress };
};

const updateProjectAssignment = async (projectId, memberIds = []) => {
  await User.updateMany(
    { _id: { $in: memberIds } },
    { $addToSet: { assignedProjects: projectId } }
  );
};

const removeProjectAssignment = async (projectId, memberIds = []) => {
  await User.updateMany(
    { _id: { $in: memberIds } },
    { $pull: { assignedProjects: projectId } }
  );
};

exports.createProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, description, deadline, priority, teamMembers, status } = req.body;
    const now = new Date();

    if (new Date(deadline) <= now) {
      return res.status(400).json({
        success: false,
        message: 'Deadline must be a future date'
      });
    }

    const existingProject = await Project.findOne({
      name: { $regex: `^${name.trim()}$`, $options: 'i' }
    });

    if (existingProject) {
      return res.status(400).json({
        success: false,
        message: 'Project name already exists'
      });
    }

    const project = await Project.create({
      name: name.trim(),
      description,
      deadline,
      priority: priority || 'medium',
      status: status || 'active',
      teamMembers: teamMembers || [],
      createdBy: req.user._id
    });

    if (Array.isArray(teamMembers) && teamMembers.length > 0) {
      await updateProjectAssignment(project._id, teamMembers);
    }

    const populatedProject = await Project.findById(project._id)
      .populate('teamMembers', 'name email role status')
      .populate('createdBy', 'name email');

    const progressData = await getProjectProgress(project._id);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: { ...populatedProject.toObject(), progress: progressData.progress }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Project name already exists'
      });
    }

    const isProduction = process.env.NODE_ENV === 'production';
    res.status(500).json({
      success: false,
      message: 'Server error creating project',
      ...(isProduction ? {} : { error: error.message })
    });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'member') {
      query = {
        $or: [
          { teamMembers: req.user._id },
          { createdBy: req.user._id }
        ]
      };
    }

    const projects = await Project.find(query)
      .populate('teamMembers', 'name email role status')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    const projectsWithProgress = await Promise.all(
      projects.map(async (project) => {
        const progressData = await getProjectProgress(project._id);
        return {
          ...project.toObject(),
          progress: progressData.progress,
          totalTasks: progressData.totalTasks,
          overdueTasks: progressData.overdueTasks
        };
      })
    );

    res.status(200).json({
      success: true,
      count: projectsWithProgress.length,
      data: projectsWithProgress
    });
  } catch (error) {
    const isProduction = process.env.NODE_ENV === 'production';
    res.status(500).json({
      success: false,
      message: 'Server error fetching projects',
      ...(isProduction ? {} : { error: error.message })
    });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('teamMembers', 'name email role status')
      .populate('createdBy', 'name email');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (req.user.role === 'member') {
      const isTeamMember = project.teamMembers.some(
        member => member._id.toString() === req.user._id.toString()
      );
      const isCreator = project.createdBy._id.toString() === req.user._id.toString();

      if (!isTeamMember && !isCreator) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    }

    const progressData = await getProjectProgress(project._id);
    res.status(200).json({
      success: true,
      data: {
        ...project.toObject(),
        progress: progressData.progress,
        totalTasks: progressData.totalTasks,
        overdueTasks: progressData.overdueTasks
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Project name already exists'
      });
    }

    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error fetching project',
      ...(process.env.NODE_ENV === 'production' ? {} : { error: error.message })
    });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const existing = await Project.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (req.body.deadline && new Date(req.body.deadline) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Deadline must be a future date'
      });
    }

    if (req.body.name) {
      const duplicate = await Project.findOne({
        _id: { $ne: req.params.id },
        name: { $regex: `^${req.body.name.trim()}$`, $options: 'i' }
      });
      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: 'Project name already exists'
        });
      }
    }

    const oldTeamMembers = existing.teamMembers.map(member => member.toString());
    const newTeamMembers = Array.isArray(req.body.teamMembers) ? req.body.teamMembers.map(String) : null;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        name: req.body.name ? req.body.name.trim() : existing.name
      },
      { new: true, runValidators: true }
    )
      .populate('teamMembers', 'name email role status')
      .populate('createdBy', 'name email');

    if (newTeamMembers) {
      const addedMembers = newTeamMembers.filter(id => !oldTeamMembers.includes(id));
      const removedMembers = oldTeamMembers.filter(id => !newTeamMembers.includes(id));
      await updateProjectAssignment(project._id, addedMembers);
      await removeProjectAssignment(project._id, removedMembers);
    }

    const progressData = await getProjectProgress(project._id);
    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: { ...project.toObject(), progress: progressData.progress }
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error updating project',
      ...(process.env.NODE_ENV === 'production' ? {} : { error: error.message })
    });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    await Task.deleteMany({ project: req.params.id });
    await removeProjectAssignment(project._id, project.teamMembers.map(member => member.toString()));
    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Project and associated tasks deleted successfully'
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error deleting project',
      ...(process.env.NODE_ENV === 'production' ? {} : { error: error.message })
    });
  }
};

exports.getProjectStats = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('teamMembers', '_id')
      .populate('createdBy', '_id');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (req.user.role === 'member') {
      const isTeamMember = project.teamMembers.some(
        (member) => member._id.toString() === req.user._id.toString()
      );
      const isCreator = project.createdBy._id.toString() === req.user._id.toString();

      if (!isTeamMember && !isCreator) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    }

    const stats = await Task.aggregate([
      { $match: { project: project._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalTasks = stats.reduce((sum, stat) => sum + stat.count, 0);
    const completedTasks = stats.find(s => s._id === 'completed')?.count || 0;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        totalTasks,
        tasksByStatus: stats,
        progress,
        deadline: project.deadline
      }
    });
  } catch (error) {
    const isProduction = process.env.NODE_ENV === 'production';
    res.status(500).json({
      success: false,
      message: 'Server error fetching project stats',
      ...(isProduction ? {} : { error: error.message })
    });
  }
};
