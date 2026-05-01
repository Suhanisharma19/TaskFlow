const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectStats
} = require('../controllers/projectController');
const {
  createProjectValidation,
  updateProjectValidation,
  mongoIdParamValidation,
  handleValidationErrors
} = require('../utils/validators');

// All routes require authentication
router.use(protect);

// POST /api/projects - Create project (Admin only)
router.post('/', requireAdmin, createProjectValidation, handleValidationErrors, createProject);

// GET /api/projects - Get all projects
router.get('/', getAllProjects);

// GET /api/projects/:id/stats - Get project statistics
router.get('/:id/stats', mongoIdParamValidation('id'), handleValidationErrors, getProjectStats);

// GET /api/projects/:id - Get single project
router.get('/:id', mongoIdParamValidation('id'), handleValidationErrors, getProjectById);

// PUT /api/projects/:id - Update project (Admin only)
router.put('/:id', requireAdmin, mongoIdParamValidation('id'), updateProjectValidation, handleValidationErrors, updateProject);

// DELETE /api/projects/:id - Delete project (Admin only)
router.delete('/:id', requireAdmin, mongoIdParamValidation('id'), handleValidationErrors, deleteProject);

module.exports = router;
