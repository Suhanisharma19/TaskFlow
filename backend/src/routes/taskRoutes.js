const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');
const {
  createTask,
  getAllTasks,
  getTasksByProject,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const {
  createTaskValidation,
  updateTaskValidation,
  mongoIdParamValidation,
  handleValidationErrors
} = require('../utils/validators');

// All routes require authentication
router.use(protect);

// POST /api/tasks - Create task
router.post('/', createTaskValidation, handleValidationErrors, createTask);

// GET /api/tasks - Get all tasks with filters
router.get('/', getAllTasks);

// GET /api/tasks/project/:projectId - Get tasks by project
router.get('/project/:projectId', mongoIdParamValidation('projectId'), handleValidationErrors, getTasksByProject);

// PUT /api/tasks/:id - Update task
router.put('/:id', mongoIdParamValidation('id'), updateTaskValidation, handleValidationErrors, updateTask);

// DELETE /api/tasks/:id - Delete task (Admin only)
router.delete('/:id', requireAdmin, mongoIdParamValidation('id'), handleValidationErrors, deleteTask);

module.exports = router;
