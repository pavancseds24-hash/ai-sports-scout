const express = require('express');
const router = express.Router();
const athleteController = require('../controllers/athleteController');

// Ensure these are functions and not undefined
router.post('/register', athleteController.registerAthlete);
router.post('/ask-coach', athleteController.askAICoach);
router.get('/matches', athleteController.getRecruiterMatches);

module.exports = router;