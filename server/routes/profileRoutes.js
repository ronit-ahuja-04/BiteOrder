const express = require('express');
const router = express.Router();

const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Secure Profile API - IDOR protection
router.get('/:id', protect, async (req, res) => {
  try {
    // Ownership verification: req.user comes from the verified JWT (trusted),
    // req.params.id comes from the URL (untrusted). Admins may view any profile.
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Access denied. You can only access your own profile.',
      });
    }

    // Fetch the profile only after the ownership check passed
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    return res.status(200).json({ profile: user });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
