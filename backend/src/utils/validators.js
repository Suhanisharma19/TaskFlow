const { body, param, validationResult } = require('express-validator');

/**
 * Reusable validation rules
 */

// Auth validations
exports.signupValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 50 }).withMessage('Name too long'),
  body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('role').optional().isIn(['admin', 'member']).withMessage('Invalid role'),
  body('adminAccessKey')
    .optional()
    .isLength({ min: 8 })
    .withMessage('Admin access key must be at least 8 characters')
    .custom((value, { req }) => {
      if (req.body.role === 'admin' && (!value || !String(value).trim())) {
        throw new Error('Admin access key is required for admin signup');
      }
      return true;
    })
];

exports.loginValidation = [
  body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
];

// Project validations
exports.createProjectValidation = [
  body('name').trim().notEmpty().withMessage('Project name is required').isLength({ max: 100 }),
  body('description').optional().isLength({ max: 1000 }),
  body('deadline').isISO8601().withMessage('Invalid date format'),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('status').optional().isIn(['active', 'completed', 'delayed']),
  body('teamMembers').optional().isArray(),
  body('teamMembers.*').optional().isMongoId().withMessage('Invalid team member id')
];

exports.updateProjectValidation = [
  body('name').optional().trim().notEmpty().isLength({ max: 100 }),
  body('description').optional().isLength({ max: 1000 }),
  body('deadline').optional().isISO8601(),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('status').optional().isIn(['active', 'completed', 'delayed']),
  body('teamMembers').optional().isArray(),
  body('teamMembers.*').optional().isMongoId().withMessage('Invalid team member id')
];

// Task validations
exports.createTaskValidation = [
  body('title').trim().notEmpty().withMessage('Task title is required').isLength({ max: 150 }),
  body('description').optional().isLength({ max: 2000 }),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('status').optional().isIn(['pending', 'in-progress', 'completed', 'overdue']),
  body('dueDate').isISO8601().withMessage('Invalid date format'),
  body('assignedTo').notEmpty().withMessage('Assigned user is required').isMongoId().withMessage('Invalid assigned user id'),
  body('project').notEmpty().withMessage('Project is required').isMongoId().withMessage('Invalid project id')
];

exports.updateTaskValidation = [
  body('title').optional().trim().notEmpty().isLength({ max: 150 }),
  body('description').optional().isLength({ max: 2000 }),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('status').optional().isIn(['pending', 'in-progress', 'completed', 'overdue']),
  body('dueDate').optional().isISO8601(),
  body('assignedTo').optional().isMongoId().withMessage('Invalid assigned user id'),
  body('project').optional().isMongoId().withMessage('Invalid project id')
];

// Team member validations
exports.createTeamMemberValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 50 }).withMessage('Name too long'),
  body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('role').optional().isIn(['admin', 'member']).withMessage('Invalid role'),
  body('status').optional().isIn(['active', 'busy', 'offline']).withMessage('Invalid status')
];

exports.updateTeamMemberValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty').isLength({ max: 50 }).withMessage('Name too long'),
  body('email').optional().isEmail().withMessage('Invalid email format').normalizeEmail(),
  body('role').optional().isIn(['admin', 'member']).withMessage('Invalid role'),
  body('status').optional().isIn(['active', 'busy', 'offline']).withMessage('Invalid status')
];

// Common id validators
exports.mongoIdParamValidation = (paramName = 'id') => [
  param(paramName).isMongoId().withMessage(`Invalid ${paramName} id`)
];

exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};
