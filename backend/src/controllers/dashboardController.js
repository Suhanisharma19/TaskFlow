const Task = require('../models/Task');
const Project = require('../models/Project');

exports.getDashboardStats = async (req, res) => {
  try {
    let taskQuery = {};
    let projectQuery = {};

    if (req.user.role === 'member') {
      taskQuery.assignedTo = req.user._id;
      projectQuery = {
        $or: [
          { teamMembers: req.user._id },
          { createdBy: req.user._id }
        ]
      };
    }

    const tasksByStatus = await Task.aggregate([
      { $match: taskQuery },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const projectsByStatus = await Project.aggregate([
      { $match: projectQuery },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const now = new Date();
    const overdueTasks = await Task.countDocuments({
      ...taskQuery,
      dueDate: { $lt: now },
      status: { $nin: ['completed', 'overdue'] }
    });

    const stats = {
      totalProjects: 0,
      activeProjects: 0,
      completedProjects: 0,
      delayedProjects: 0,
      totalTasks: 0,
      completedTasks: 0,
      inProgressTasks: 0,
      pendingTasks: 0,
      overdueTasks,
      taskDistribution: []
    };

    projectsByStatus.forEach(project => {
      stats.totalProjects += project.count;
      if (project._id === 'active') stats.activeProjects = project.count;
      if (project._id === 'completed') stats.completedProjects = project.count;
      if (project._id === 'delayed') stats.delayedProjects = project.count;
    });

    tasksByStatus.forEach(task => {
      stats.totalTasks += task.count;
      if (task._id === 'completed') stats.completedTasks = task.count;
      if (task._id === 'in-progress') stats.inProgressTasks = task.count;
      if (task._id === 'pending') stats.pendingTasks = task.count;
      stats.taskDistribution.push({ status: task._id, value: task.count });
    });

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    const isProduction = process.env.NODE_ENV === 'production';
    res.status(500).json({
      success: false,
      message: 'Server error fetching dashboard stats',
      ...(isProduction ? {} : { error: error.message })
    });
  }
};

exports.getTaskTrends = async (req, res) => {
  try {
    const matchQuery = req.user.role === 'member' ? { assignedTo: req.user._id } : {};

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const taskTrends = await Task.aggregate([
      {
        $match: {
          ...matchQuery,
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    const formattedTrends = taskTrends.map(item => ({
      date: `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`,
      tasks: item.count
    }));

    res.status(200).json({
      success: true,
      data: formattedTrends
    });
  } catch (error) {
    const isProduction = process.env.NODE_ENV === 'production';
    res.status(500).json({
      success: false,
      message: 'Server error fetching task trends',
      ...(isProduction ? {} : { error: error.message })
    });
  }
};

exports.getTeamActivity = async (req, res) => {
  try {
    const query = req.user.role === 'member' ? { assignedTo: req.user._id } : {};

    const recentTasks = await Task.find(query)
      .populate('assignedTo', 'name')
      .populate('project', 'name')
      .sort({ updatedAt: -1 })
      .limit(20);

    const activities = recentTasks.map(task => {
      let action = 'created';
      if (task.status === 'completed') action = 'completed';
      else if (task.status === 'in-progress') action = 'started working on';
      else if (task.status === 'overdue') action = 'missed a deadline on';

      return {
        id: task._id,
        user: task.assignedTo?.name || 'Unknown',
        action,
        taskTitle: task.title,
        projectName: task.project?.name || 'Unknown',
        timestamp: task.updatedAt
      };
    });

    res.status(200).json({
      success: true,
      data: activities
    });
  } catch (error) {
    const isProduction = process.env.NODE_ENV === 'production';
    res.status(500).json({
      success: false,
      message: 'Server error fetching activity',
      ...(isProduction ? {} : { error: error.message })
    });
  }
};

exports.getUpcomingDeadlines = async (req, res) => {
  try {
    const query = {
      status: { $ne: 'completed' }
    };

    if (req.user.role === 'member') {
      query.assignedTo = req.user._id;
    }

    const now = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

    const deadlines = await Task.find({
      ...query,
      dueDate: { $gte: now, $lte: sevenDaysLater }
    })
      .populate('assignedTo', 'name')
      .populate('project', 'name')
      .sort({ dueDate: 1 })
      .limit(10);

    res.status(200).json({
      success: true,
      count: deadlines.length,
      data: deadlines
    });
  } catch (error) {
    const isProduction = process.env.NODE_ENV === 'production';
    res.status(500).json({
      success: false,
      message: 'Server error fetching deadlines',
      ...(isProduction ? {} : { error: error.message })
    });
  }
};
