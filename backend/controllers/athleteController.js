const db = require('../config/db');
const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.registerAthlete = async (req, res) => {
    const { name, age, sport, location, stats, achievements } = req.body;
    try {
        // GEN AI PROMPT: This is the "Brain" of your project
        const prompt = `You are a professional sports scout. Analyze this athlete:
        Name: ${name}, Sport: ${sport}, Age: ${age}, Stats: ${stats}.
        
        TASK:
        1. Compare these stats to the benchmarks of elite ${sport} legends (e.g., Virat Kohli or Sunil Chhetri).
        2. Provide a Performance Summary.
        3. Identify Strengths/Weaknesses compared to those pros.
        4. Assign a Talent Grade (A, B, or C) and an AI Score (0-100).`;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        });

        const analysis = response.choices[0].message.content;

        const [result] = await db.execute(
            `INSERT INTO athletes (name, age, sport, location, stats, ai_summary, ai_score) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, age, sport, location, stats, analysis, 85]
        );

        res.status(201).json({ message: "Athlete registered!", analysis });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "AI API Error. Check your OpenAI credits!" });
    }
};

// Add these to prevent the "handler must be a function" error
exports.askAICoach = async (req, res) => { /* logic here */ };
exports.getRecruiterMatches = async (req, res) => { /* logic here */ };