const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  getDashboardStats,
  getTaskTrends,
  getTeamActivity,
  getUpcomingDeadlines
} = require('../controllers/dashboardController');

// All routes require authentication
router.use(protect);

// GET /api/dashboard/stats - Get dashboard statistics
router.get('/stats', getDashboardStats);

// GET /api/dashboard/task-trends - Get task trends
router.get('/task-trends', getTaskTrends);

// GET /api/dashboard/activity - Get team activity
router.get('/activity', getTeamActivity);

// GET /api/dashboard/deadlines - Get upcoming deadlines
router.get('/deadlines', getUpcomingDeadlines);

module.exports = router;
