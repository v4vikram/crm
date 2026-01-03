const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staff.controller');
const { protect, adminOnly } = require('../middlewares/authMiddleware');


router.get('/', protect, adminOnly, staffController.getAllStaff);
router.get('/:id', protect, adminOnly, staffController.getStaffById);
router.post('/', protect, adminOnly, staffController.createStaff);
router.put('/:id', protect, adminOnly, staffController.updateStaff);
router.delete('/:id', protect, adminOnly, staffController.deleteStaff);

module.exports = router;
