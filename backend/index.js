const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const athleteRoutes = require('./routes/athleteRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Main Routes
app.use('/api/athletes', athleteRoutes);

app.get('/', (req, res) => {
    res.send('AI Sports Scout Server is Running!');
});

app.listen(PORT, () => {
    console.log(`Server is sprinting on port ${PORT}`);
});