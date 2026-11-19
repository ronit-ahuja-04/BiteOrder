const express = require('express');
const { register, login, getMe, getUsers } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/auth');
const { registerRules, loginRules } = require('../middleware/validate');

const router = express.Router();
router.post('/register', registerRules, register);
router.post('/login', loginRules, login);
router.get('/me', protect, getMe);
router.get('/users', protect, adminOnly, getUsers);
module.exports = router;
