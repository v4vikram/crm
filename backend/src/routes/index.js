const express = require('express');
const authRoutes = require('./auth.routes');
const leadRoutes = require('./lead.routes');
const staffRoutes = require('./staff.routes');
const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/leads', leadRoutes);
router.use('/staff', staffRoutes);

module.exports = router;
