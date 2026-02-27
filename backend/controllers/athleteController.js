const db = require('../config/db');

// Mock AI Logic to bypass Quota/API errors
const getMockAnalysis = (sport) => `
Performance Summary: Excellent physical conditioning and technical skill in ${sport}.
Strengths: High endurance, tactical awareness, and speed.
Weaknesses: Needs improvement in high-pressure decision-making.
Improvement Suggestions: Focus on interval training and mental game simulations.
Talent Grade: A`;

const getMockCoachAdvice = (sport, question) => `
Goal: Improve ${sport} technique.
Training Drills: 1. Shadow practice (15 mins), 2. High-intensity intervals (20 mins).
Weekly Plan: Mon/Wed: Skill work. Tue/Thu: Strength. Fri: Match play.
Diet Suggestions: Increase protein intake and stay hydrated with electrolytes.
Common Mistakes: Rushing the technique instead of focusing on form.`;

exports.registerAthlete = async (req, res) => {
    const { name, age, sport, location, performance_stats } = req.body;
    try {
        const analysis = getMockAnalysis(sport);
        const [result] = await db.execute(
            `INSERT INTO athletes (name, age, sport, location, performance_stats, ai_summary, ai_score) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, age, sport, location, JSON.stringify(performance_stats), analysis, 85]
        );
        res.status(201).json({ message: "Athlete registered!", id: result.insertId, analysis });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.askAICoach = async (req, res) => {
    const { athlete_id, question } = req.body;
    try {
        const [athlete] = await db.execute('SELECT sport FROM athletes WHERE id = ?', [athlete_id]);
        const sport = athlete[0]?.sport || "General";
        const advice = getMockCoachAdvice(sport, question);
        await db.execute('INSERT INTO coach_queries (athlete_id, query, ai_response) VALUES (?, ?, ?)', [athlete_id, question, advice]);
        res.json({ coach_advice: advice });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRecruiterMatches = async (req, res) => {
    try {
        const { sport } = req.query;
        const [athletes] = await db.execute('SELECT * FROM athletes WHERE sport = ?', [sport]);
        const matchedAthletes = athletes.map(a => ({
            ...a, compatibility: `This athlete matches 85% of your selection criteria for ${sport}.`
        }));
        res.json(matchedAthletes);
    } catch (error) { res.status(500).json({ error: error.message }); }
};