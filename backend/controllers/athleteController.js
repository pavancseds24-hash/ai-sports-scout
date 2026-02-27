exports.deepAnalyze = async (req, res) => {
    const { stats, history } = req.body;
    try {
        const prompt = `Based on these stats: ${stats} and league history: ${history}, provide a 3-year career roadmap to secure a professional contract. Compare against top athletes in this category.`;
        
        // Try LLM, use local fail-safe if quota is out
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }]
        });
        res.json({ analysis: response.choices[0].message.content });
    } catch (e) {
        res.json({ analysis: "LOCAL ADVICE: Focus on state-level trials this year. Improving your average by 15% will put you in the top 5% of your age group, securing a spot in regional academies." });
    }
};