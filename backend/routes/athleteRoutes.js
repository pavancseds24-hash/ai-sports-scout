const express = require('express');
const router = express.Router();
const { registerAthlete, getAthleteStats } = require('../controllers/athleteController');

// Route to register and analyze an athlete
router.post('/register', registerAthlete);

// Route to get athlete data
router.get('/:id', getAthleteStats);

module.exports = router;