const express = require('express');
const router = express.Router();
const leadController = require('../controllers/lead.controller');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

router.route('/')
    .post(protect, adminOnly, leadController.createLead)
    .get(protect, leadController.getLeads);

router.route('/:id')
    .get(protect, leadController.getLeadById)
    .put(protect, adminOnly, leadController.updateLead)
    .delete(protect, adminOnly, leadController.deleteLead);

module.exports = router;
