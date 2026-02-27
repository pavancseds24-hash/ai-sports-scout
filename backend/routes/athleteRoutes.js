const express = require('express');
const router = express.Router();
const athleteController = require('../controllers/athleteController');

// Ensure these functions exist in the controller file above
router.post('/register', athleteController.registerAthlete);
router.post('/ask-coach', athleteController.askAICoach);
router.get('/recruiters/matches', athleteController.getRecruiterMatches);

module.exports = router;