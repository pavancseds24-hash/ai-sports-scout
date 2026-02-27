const express = require('express');
const router = express.Router();
const athleteController = require('../controllers/athleteController');

// Define routes clearly
router.post('/register', athleteController.registerAthlete);
router.post('/deep-analyze', athleteController.deepAnalyze); // New route for the Analyze tab
router.get('/matches', athleteController.getRecruiterMatches);

module.exports = router;