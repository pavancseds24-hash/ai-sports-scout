const db = require('../config/db');
const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.registerAthlete = async (req, res) => {
    const { name, age, sport, location, performance_stats, achievements, video_link } = req.body;

    try {
        // 1. Prepare data for AI
        const statsString = JSON.stringify(performance_stats);
        const prompt = `Analyze this ${sport} athlete:
        Name: ${name}, Age: ${age}, Stats: ${statsString}.
        Provide a Performance summary, Strengths, Weaknesses, and a Talent Grade (A, B, or C). 
        Format as JSON.`;

        // 2. Call AI (Using a placeholder check for hackathon speed)
        const aiResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        });

        const analysis = aiResponse.choices[0].message.content;

        // 3. Save to Database
        const [result] = await db.execute(
            `INSERT INTO athletes (name, age, sport, location, performance_stats, achievements, video_link, ai_summary) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, age, sport, location, statsString, achievements, video_link, analysis]
        );

        res.status(201).json({ message: "Athlete registered!", id: result.insertId, analysis });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to register athlete" });
    }
};

exports.getAthleteStats = async (req, res) => {
    const [rows] = await db.execute('SELECT * FROM athletes WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
};