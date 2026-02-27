const express = require('express');
const router = express.Router();
const athleteController = require('../controllers/athleteController');

// Ensure these functions exist in your controller!
router.post('/register', athleteController.registerAthlete);
router.post('/ask-coach', athleteController.askAICoach);
// Check if this line matches your controller function name
router.get('/matches', athleteController.getRecruiterMatches); 

module.exports = router;