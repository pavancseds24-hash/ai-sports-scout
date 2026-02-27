import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [view, setView] = useState('register');
  const [sport, setSport] = useState('Cricket');
  const [subType, setSubType] = useState('');
  const [form, setForm] = useState({});
  const [results, setResults] = useState({ analysis: '', coach: '', athletes: [] });

  const handleAction = async (type) => {
    try {
      const base = "http://localhost:5000/api/athletes";
      if (type === 'reg') {
        const res = await axios.post(`${base}/register`, { ...form, sport, subType });
        setResults({ ...results, analysis: res.data.analysis });
        alert("Registration Successful!");
      } else if (type === 'coach') {
        const res = await axios.post(`${base}/ask-coach`, { question: form.coachQ });
        setResults({ ...results, coach: res.data.coach_advice });
      } else {
        const res = await axios.get(`${base}/matches`);
        setResults({ ...results, athletes: res.data });
      }
    } catch (e) { alert("Backend connection failed."); }
  };

  return (
    <div style={{ background: '#0f172a', color: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <nav style={{ background: '#1e293b', padding: '20px', display: 'flex', gap: '20px', borderBottom: '2px solid #334155' }}>
        <h2 style={{ color: '#38bdf8', margin: 0 }}>SCOUT AI</h2>
        {['register', 'analyzer', 'coach', 'recruiter'].map(t => <button key={t} onClick={() => setView(t)} style={{ background: 'none', border: 'none', color: view === t ? '#38bdf8' : '#94a3b8', cursor: 'pointer', fontWeight: 'bold' }}>{t.toUpperCase()}</button>)}
      </nav>

      <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px' }}>
        {view === 'register' && (
          <div style={s.card}>
            <h3>1. Athlete Registration</h3>
            <input style={s.in} placeholder="Name" onChange={e => setForm({...form, name: e.target.value})} />
            <select style={s.in} onChange={e => { setSport(e.target.value); setSubType(''); }}>
                <option>Cricket</option><option>Football</option><option>Athletics</option>
            </select>
            {sport === 'Cricket' && (
              <select style={s.in} onChange={e => setSubType(e.target.value)}>
                <option value="">Select Specialty</option><option>Batting</option><option>Bowling</option>
              </select>
            )}
            {subType === 'Batting' && <><input style={s.in} placeholder="Average" onChange={e=>setForm({...form, avg: e.target.value})} /><input style={s.in} placeholder="Strike Rate" onChange={e=>setForm({...form, sr: e.target.value})} /></>}
            {subType === 'Bowling' && <><input style={s.in} placeholder="Wickets" onChange={e=>setForm({...form, wkts: e.target.value})} /><input style={s.in} placeholder="Economy" onChange={e=>setForm({...form, eco: e.target.value})} /></>}
            <button style={s.btn} onClick={() => handleAction('reg')}>REGISTER & ANALYZE</button>
          </div>
        )}

        {view === 'analyzer' && (
          <div style={s.card}>
            <h3>2 & 4. Elite Comparison Analyzer</h3>
            <div style={s.resBox}>{results.analysis || "Results will appear after registration."}</div>
          </div>
        )}

        {view === 'coach' && (
          <div style={s.card}>
            <h3>3. AI Coach (Gen AI)</h3>
            <input style={s.in} placeholder="How can I improve my bowling pace?" onChange={e => setForm({...form, coachQ: e.target.value})} />
            <button style={{...s.btn, background: '#38bdf8'}} onClick={() => handleAction('coach')}>ASK AI COACH</button>
            {results.coach && <div style={s.resBox}>{results.coach}</div>}
          </div>
        )}

        {view === 'recruiter' && (
          <div style={s.card}>
            <h3>5. Recruiter Match System</h3>
            <button style={s.btn} onClick={() => handleAction('match')}>REFRESH ATHLETES</button>
            {results.athletes.map(a => (
              <div key={a.id} style={{ borderBottom: '1px solid #334155', padding: '15px' }}>
                <strong>{a.name}</strong> - {a.sport} ({a.ai_score}%)
                <p style={{ fontSize: '12px', color: '#94a3b8' }}>{a.ai_summary.substring(0, 150)}...</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  card: { background: '#1e293b', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' },
  in: { width: '100%', padding: '12px', margin: '10px 0', background: '#0f172a', color: 'white', border: '1px solid #334155', borderRadius: '6px' },
  btn: { width: '100%', padding: '15px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  resBox: { marginTop: '20px', padding: '20px', background: '#0f172a', borderLeft: '4px solid #38bdf8', borderRadius: '4px', whiteSpace: 'pre-wrap' }
};

export default App;