import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [view, setView] = useState('register');
  const [sport, setSport] = useState('Cricket');
  const [subType, setSubType] = useState(''); // Batting or Bowling
  const [form, setForm] = useState({});
  const [results, setResults] = useState({ analysis: '', matches: [] });

  const sportsFields = {
    Cricket: {
      Batting: ['Average', 'Strike Rate', 'Matches', 'Highest Score'],
      Bowling: ['Average', 'Wickets', 'Economy', 'Matches']
    },
    Football: ['Goals', 'Assists', 'Matches', 'Position'],
    Athletics: ['Best Timing', 'Event Name', 'Leagues Played']
  };

  const handleRegister = async () => {
    try {
        // Fail-safe: Always save to DB even if AI is out of quota
        const res = await axios.post('http://localhost:5000/api/athletes/register', {
            ...form, sport, subType, name: form.name, location: form.location
        });
        setResults({ ...results, analysis: res.data.analysis });
        alert("Registration Successful!");
    } catch (e) { alert("Registration Error."); }
  };

  return (
    <div style={s.container}>
      <nav style={s.nav}>
        <button onClick={() => setView('register')}>Register</button>
        <button onClick={() => setView('analyze')}>Deep AI Analysis</button>
        <button onClick={() => setView('recruiter')}>Recruiter Dashboard</button>
      </nav>

      {view === 'register' && (
        <div style={s.card}>
          <h3>Athlete Entry</h3>
          <input placeholder="Name" style={s.inp} onChange={e => setForm({...form, name: e.target.value})} />
          <select style={s.inp} onChange={e => { setSport(e.target.value); setSubType(''); }}>
            <option>Cricket</option><option>Football</option><option>Athletics</option>
          </select>

          {sport === 'Cricket' && (
            <select style={s.inp} onChange={e => setSubType(e.target.value)}>
              <option value="">Select Specialty</option>
              <option>Batting</option><option>Bowling</option>
            </select>
          )}

          {/* Dynamic Fields */}
          {(sport === 'Cricket' ? sportsFields[sport][subType] : sportsFields[sport])?.map(field => (
            <input key={field} placeholder={field} style={s.inp} onChange={e => setForm({...form, [field]: e.target.value})} />
          ))}

          <button style={s.btn} onClick={handleRegister}>Save to Scout Database</button>
        </div>
      )}

      {view === 'analyze' && (
        <div style={s.card}>
          <h3>Pro Comparison & Career Path</h3>
          <textarea style={{...s.inp, height: '100px'}} placeholder="Paste all your stats and league history here for deep analysis..." />
          <button style={{...s.btn, background: '#1a73e8'}} onClick={() => {/* Call Deep Analyze API */}}>Analyze My Future</button>
          <div style={s.resBox}>
            <strong>AI Career Advisor:</strong>
            <p>Your stats will be compared to legends like Virat Kohli. We will suggest 3-year milestones to secure your future in professional sports.</p>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
    container: { background: '#f4f7f6', minHeight: '100vh', fontFamily: 'Arial' },
    nav: { background: '#2c3e50', padding: '15px', display: 'flex', gap: '20px', color: 'white' },
    card: { maxWidth: '700px', margin: '30px auto', background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
    inp: { width: '100%', padding: '12px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' },
    btn: { width: '100%', padding: '15px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    resBox: { marginTop: '20px', padding: '15px', borderLeft: '5px solid #1a73e8', background: '#eef6ff' }
};

export default App;