const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { getMembers } = require('../controllers/userController');

router.use(protect);

// GET /api/users/members - Get all users with role=member
router.get('/members', getMembers);

module.exports = router;
