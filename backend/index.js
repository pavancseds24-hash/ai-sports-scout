const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const athleteRoutes = require('./routes/athleteRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(bodyParser.json());

// Main Routes
app.use('/api/athletes', athleteRoutes);


app.get('/', (req, res) => {
    res.send('AI Sports Scout Server is Running!');
});

app.listen(PORT, () => {
    console.log(`Server is sprinting on port ${PORT}`);
});

app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT 1 + 1 AS result');
    res.json({ message: "Database is connected!", data: rows });
  } catch (err) {
    res.status(500).json({ error: "Database connection failed", details: err.message });
  }
});