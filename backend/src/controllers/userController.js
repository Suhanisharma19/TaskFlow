const User = require('../models/User');

exports.getMembers = async (req, res) => {
  try {
    const members = await User.find({ role: 'member' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    const isProduction = process.env.NODE_ENV === 'production';
    res.status(500).json({
      success: false,
      message: 'Server error fetching members',
      ...(isProduction ? {} : { error: error.message })
    });
  }
};
