const db = require('../config/db');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini with your API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// 1. & 4. Registration & Elite Comparison Analyzer
exports.registerAthlete = async (req, res) => {
    // We pull everything from req.body to be safe
    const { name, age, sport, subType, location, achievements, ...otherStats } = req.body;
    
    try {
        // 1. Prepare the dynamic stats object
        const finalStats = JSON.stringify(otherStats);

        // 2. Gemini AI Analysis (Elite Comparison)
        const prompt = `Scout Report for ${name}: Compare this ${sport} ${subType} player against benchmarks of pros like ${sport === 'Cricket' ? 'Virat Kohli' : 'top stars'}. Stats: ${finalStats}`;
        const result = await model.generateContent(prompt);
        const analysis = result.response.text();

        // 3. Database Insert
        const [dbRes] = await db.execute(
            `INSERT INTO athletes (name, age, sport, sub_type, location, performance_stats, achievements, ai_summary, ai_score) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, age, sport, subType, location, finalStats, achievements, analysis, 85]
        );

        res.status(201).json({ message: "Success!", analysis });
    } catch (error) {
        console.error("FULL BACKEND ERROR:", error); // This helps you debug in the terminal
        res.status(500).json({ error: error.message });
    }
};