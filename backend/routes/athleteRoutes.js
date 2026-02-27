const express = require('express');
const router = express.Router();
const athleteController = require('../controllers/athleteController');

router.post('/register', athleteController.registerAthlete);
router.post('/ask-coach', athleteController.askAICoach);
router.get('/matches', athleteController.getRecruiterMatches); // Matches the controller name

module.exports = router;