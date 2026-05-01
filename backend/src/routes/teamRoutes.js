const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');
const {
  getTeamMembers,
  getTeamMember,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember
} = require('../controllers/teamController');
const {
  createTeamMemberValidation,
  updateTeamMemberValidation,
  mongoIdParamValidation,
  handleValidationErrors
} = require('../utils/validators');

router.use(protect);

router.get('/', getTeamMembers);
router.get('/:id', mongoIdParamValidation('id'), handleValidationErrors, getTeamMember);
router.post('/', requireAdmin, createTeamMemberValidation, handleValidationErrors, createTeamMember);
router.put('/:id', requireAdmin, mongoIdParamValidation('id'), updateTeamMemberValidation, handleValidationErrors, updateTeamMember);
router.delete('/:id', requireAdmin, mongoIdParamValidation('id'), handleValidationErrors, deleteTeamMember);

module.exports = router;
