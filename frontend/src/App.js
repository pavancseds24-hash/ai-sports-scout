import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [formData, setFormData] = useState({ name: '', age: '', sport: 'Cricket', stats: '' });
  const [analysis, setAnalysis] = useState("");
  const [coachQuestion, setCoachQuestion] = useState("");
  const [coachAdvice, setCoachAdvice] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/athletes/register', {
        ...formData, performance_stats: { summary: formData.stats }
      });
      setAnalysis(res.data.analysis);
      alert("Athlete Profile Created!");
    } catch (err) { alert("Check if Backend is running!"); }
  };

  const askCoach = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/athletes/ask-coach', {
        athlete_id: 1, // Placeholder ID
        question: coachQuestion
      });
      setCoachAdvice(res.data.coach_advice);
    } catch (err) { alert("AI Coach is busy!"); }
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px', fontFamily: 'Arial' }}>
      <h1 style={{ textAlign: 'center' }}>🏆 AI Sports Scout</h1>
      
      <div style={{ background: '#f4f4f4', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
        <h2>Step 1: Athlete Registration</h2>
        <form onSubmit={handleRegister}>
          <input style={s.input} type="text" placeholder="Name" onChange={e => setFormData({...formData, name: e.target.value})} required />
          <input style={s.input} type="number" placeholder="Age" onChange={e => setFormData({...formData, age: e.target.value})} required />
          <select style={s.input} onChange={e => setFormData({...formData, sport: e.target.value})}>
            <option>Cricket</option><option>Football</option><option>Basketball</option><option>Kabaddi</option>
          </select>
          <input style={s.input} type="text" placeholder="Stats (e.g. 50 runs, 2 wickets)" onChange={e => setFormData({...formData, stats: e.target.value})} />
          <button style={s.btn} type="submit">Analyze & Register</button>
        </form>
        {analysis && <div style={s.box}><strong>AI Analysis:</strong><p>{analysis}</p></div>}
      </div>

      <div style={{ background: '#e8f4fd', padding: '20px', borderRadius: '10px' }}>
        <h2>Step 2: Ask the AI Coach</h2>
        <input style={s.input} type="text" placeholder="How can I improve my bowling pace?" onChange={e => setCoachQuestion(e.target.value)} />
        <button style={{...s.btn, background: '#2980b9'}} onClick={askCoach}>Ask Coach</button>
        {coachAdvice && <div style={s.box}><strong>Coach Advice:</strong><p style={{whiteSpace: 'pre-wrap'}}>{coachAdvice}</p></div>}
      </div>
    </div>
  );
}

const s = {
  input: { width: '100%', padding: '10px', marginBottom: '10px', display: 'block', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '10px', background: '#27ae60', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px' },
  box: { marginTop: '15px', padding: '15px', background: 'white', borderLeft: '5px solid #2ecc71', borderRadius: '4px' }
};

const handleRegister = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post('http://localhost:5000/api/athletes/register', {
      ...formData, performance_stats: { summary: formData.stats }
    });
    setAnalysis(res.data.analysis);
    alert("Profile Created!");
  } catch (err) { 
    console.error(err);
    alert("Backend Error: " + (err.response?.data?.error || err.message)); 
  }
};

export default App;