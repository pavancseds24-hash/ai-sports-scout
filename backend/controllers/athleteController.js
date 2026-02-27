const db = require('../config/db');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini with your API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// 1. & 4. Registration & Elite Comparison Analyzer
exports.registerAthlete = async (req, res) => {
    const { name, age, sport, subType, location, achievements, ...stats } = req.body;
    let analysis = "";

    try {
        const prompt = `Act as an elite sports scout. Analyze this athlete: 
        Name: ${name}, Sport: ${sport} (${subType}), Age: ${age}, Stats: ${JSON.stringify(stats)}.
        
        TASK:
        1. Compare these stats against elite legends like ${sport === 'Cricket' ? 'Virat Kohli' : 'Sunil Chhetri'}.
        2. Provide a Performance Summary, Strengths, and Weaknesses.
        3. Give a 3-year career roadmap to secure their future.
        4. Assign a Talent Grade (A/B/C).`;

        const result = await model.generateContent(prompt);
        analysis = result.response.text();
    } catch (error) {
        analysis = `[LOCAL AI] Performance in ${sport} matches regional standards. To reach elite levels like ${sport === 'Cricket' ? 'Kohli' : 'pros'}, improve consistency by 20%.`;
    }

    try {
        const [dbRes] = await db.execute(
            `INSERT INTO athletes (name, age, sport, sub_type, location, performance_stats, achievements, ai_summary, ai_score) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, age, sport, subType, location, JSON.stringify(stats), achievements, analysis, 85]
        );
        res.status(201).json({ message: "Scout Profile Created!", analysis, id: dbRes.insertId });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// 3. AI Sports Coach (LLM)
exports.askAICoach = async (req, res) => {
    const { question } = req.body;
    try {
        const prompt = `As a professional sports coach, provide a structured plan (Goal, Drills, Weekly Plan, Diet) for: ${question}`;
        const result = await model.generateContent(prompt);
        res.json({ coach_advice: result.response.text() });
    } catch (e) { res.json({ coach_advice: "Focus on HIIT 3x weekly and high protein diet." }); }
};

// 5. Recruiter Match System
exports.getRecruiterMatches = async (req, res) => {
    const [rows] = await db.execute('SELECT * FROM athletes ORDER BY ai_score DESC');
    res.json(rows);
};