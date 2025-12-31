const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/staff', protect, adminOnly, authController.getStaff);

module.exports = router;
