import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [tab, setTab] = useState('register');
  const [form, setForm] = useState({ name: '', age: '', sport: 'Cricket', location: '', stats: '', achievements: '' });
  const [results, setResults] = useState({ analysis: '', coach: '', athletes: [] });

  const apiCall = async (type) => {
    try {
      if (type === 'reg') {
        const res = await axios.post('http://localhost:5000/api/athletes/register', form);
        setResults({ ...results, analysis: res.data.analysis });
        alert("Athlete Profile Saved & Analyzed!");
      } else if (type === 'coach') {
        const res = await axios.post('http://localhost:5000/api/athletes/ask-coach', { athlete_id: 1, question: "Plan?" });
        setResults({ ...results, coach: res.data.coach_advice });
      } else {
        const res = await axios.get(`http://localhost:5000/api/athletes/matches?sport=${form.sport}`);
        setResults({ ...results, athletes: res.data });
      }
    } catch (e) { alert("Server connection failed."); }
  };

  return (
    <div style={{ background: '#111', color: '#eee', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <nav style={{ padding: '20px', background: '#222', display: 'flex', gap: '20px' }}>
        <h2 style={{ color: '#00d1b2', margin: 0 }}>AI Sports Scout</h2>
        <button onClick={() => setTab('register')}>Register</button>
        <button onClick={() => setTab('coach')}>AI Coach</button>
        <button onClick={() => setTab('recruiter')}>Recruiters</button>
      </nav>

      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
        {tab === 'register' && (
          <div style={card}>
            <h3>Athlete Profile & AI Analysis</h3>
            <input style={inp} placeholder="Name" onChange={e => setForm({...form, name: e.target.value})} />
            <select style={inp} onChange={e => setForm({...form, sport: e.target.value})}>
              <option>Cricket</option><option>Football</option><option>Athletics</option>
            </select>
            <textarea style={inp} placeholder="Stats" onChange={e => setForm({...form, stats: e.target.value})} />
            <button style={btn} onClick={() => apiCall('reg')}>Run Gen AI Analysis</button>
            {results.analysis && <div style={resBox}>{results.analysis}</div>}
          </div>
        )}

        {tab === 'recruiter' && (
          <div style={card}>
            <h3>AI Recruiter Match System</h3>
            <button style={btn} onClick={() => apiCall('match')}>Find Matching Athletes</button>
            {results.athletes.map(a => (
              <div key={a.id} style={{ borderBottom: '1px solid #444', padding: '10px' }}>
                <strong>{a.name}</strong> - {a.sport} ({a.location}) <br/>
                <small>AI Score: {a.ai_score}%</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const card = { background: '#222', padding: '30px', borderRadius: '12px' };
const inp = { width: '100%', padding: '12px', margin: '10px 0', background: '#333', color: '#fff', border: 'none' };
const btn = { width: '100%', padding: '12px', background: '#00d1b2', color: '#fff', fontWeight: 'bold', border: 'none', cursor: 'pointer' };
const resBox = { marginTop: '20px', padding: '15px', background: '#000', borderLeft: '4px solid #00d1b2', whiteSpace: 'pre-wrap' };

export default App;