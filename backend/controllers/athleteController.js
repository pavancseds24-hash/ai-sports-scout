const db = require('../config/db');
const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 4. AI Performance Analyzer (Elite Comparison)
exports.registerAthlete = async (req, res) => {
    const { name, age, sport, location, performance_stats, achievements } = req.body;
    try {
        const statsStr = JSON.stringify(performance_stats);
        
        const prompt = `
        You are an elite sports scout. Analyze this athlete:
        - Name: ${name}
        - Sport: ${sport}
        - Age: ${age}
        - Current Stats: ${statsStr}
        - Achievements: ${achievements}

        GEN AI TASK:
        1. Compare these stats against the career benchmarks of elite legends in ${sport} (e.g., Virat Kohli for Cricket, Sunil Chhetri for Football, Neeraj Chopra for Athletics).
        2. Identify specific technical gaps between this athlete and the pros.
        3. Generate a "Talent Grade" (A, B, or C) and an "AI Pro-Potential Score" (0-100).
        4. Provide a structured Performance Summary, Strengths, and Weaknesses.`;

        const aiResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "system", content: "You are a professional sports analyst." }, { role: "user", content: prompt }],
        });

        const analysis = aiResponse.choices[0].message.content;

        const [result] = await db.execute(
            `INSERT INTO athletes (name, age, sport, location, performance_stats, ai_summary, ai_score) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, age, sport, location, statsStr, analysis, 85] // aiScore can be parsed from the response
        );

        res.status(201).json({ message: "Athlete registered!", id: result.insertId, analysis });
    } catch (error) {
        console.error("LLM Error:", error.message);
        res.status(500).json({ error: "LLM API Limit Reached or Quota Exceeded." });
    }
};

// 3. AI Sports Coach (Structured Plan)
exports.askAICoach = async (req, res) => {
    const { athlete_id, question } = req.body;
    try {
        const [athlete] = await db.execute('SELECT sport FROM athletes WHERE id = ?', [athlete_id]);
        const sport = athlete[0]?.sport || "General";

        const prompt = `Athlete Sport: ${sport}. Question: "${question}". 
        Provide a structured response: Goal, Training Drills, Weekly Plan, Diet Suggestions, and Common Mistakes.`;

        const aiResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        });

        res.json({ coach_advice: aiResponse.choices[0].message.content });
    } catch (error) { res.status(500).json({ error: "AI Coach is busy." }); }
};