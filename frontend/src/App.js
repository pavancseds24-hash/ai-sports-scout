import React, { useState } from 'react';
import axios from 'axios';

const API = "http://localhost:5000/api/athletes";

function App() {
  const [tab, setTab] = useState('register');
  const [form, setForm] = useState({ name: '', age: '', sport: 'Cricket', location: '', stats: '' });
  const [data, setData] = useState({ analysis: "", coachA: "", matches: [] });

  const handleAction = async (type) => {
    try {
      if (type === 'reg') {
        const res = await axios.post(`${API}/register`, { ...form, performance_stats: { val: form.stats } });
        setData({ ...data, analysis: res.data.analysis });
        alert("Success: Profile & AI Analysis Created!");
      } else if (type === 'coach') {
        const res = await axios.post(`${API}/ask-coach`, { athlete_id: 1, question: "How to improve?" });
        setData({ ...data, coachA: res.data.coach_advice });
      } else {
        const res = await axios.get(`${API}/recruiters/matches?sport=${form.sport}`);
        setData({ ...data, matches: res.data });
      }
    } catch (e) { alert("Backend Offline!"); }
  };

  return (
    <div style={{ backgroundColor: '#121212', color: 'white', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <nav style={{ padding: '20px', backgroundColor: '#1f1f1f', display: 'flex', gap: '20px', borderBottom: '1px solid #333' }}>
        <h2 style={{ margin: 0, color: '#00d1b2' }}>AI Sports Scout</h2>
        {['register', 'coach', 'recruiter'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ background: 'none', border: 'none', color: tab === t ? '#00d1b2' : '#888', cursor: 'pointer', fontWeight: 'bold' }}>
            {t.toUpperCase()}
          </button>
        ))}
      </nav>

      <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px' }}>
        {tab === 'register' && (
          <div style={{ background: '#1f1f1f', padding: '30px', borderRadius: '12px' }}>
            <h3>1 & 2. Athlete Registration & Profile System</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <input style={s.in} placeholder="Name" onChange={e => setForm({...form, name: e.target.value})} />
              <input style={s.in} placeholder="Age" type="number" onChange={e => setForm({...form, age: e.target.value})} />
              <select style={s.in} onChange={e => setForm({...form, sport: e.target.value})}>
                {['Cricket', 'Football', 'Basketball', 'Athletics', 'Kabaddi', 'Volleyball', 'Tennis', 'Badminton'].map(sp => <option key={sp}>{sp}</option>)}
              </select>
              <input style={s.in} placeholder="Location" onChange={e => setForm({...form, location: e.target.value})} />
            </div>
            <textarea style={{ ...s.in, marginTop: '15px', height: '80px' }} placeholder="Performance Stats" onChange={e => setForm({...form, stats: e.target.value})} />
            <button style={s.btn} onClick={() => handleAction('reg')}>4. RUN AI PERFORMANCE ANALYZER</button>
            {data.analysis && <div style={s.res}><h4>AI Analysis:</h4><p>{data.analysis}</p></div>}
          </div>
        )}

        {tab === 'coach' && (
          <div style={{ background: '#1f1f1f', padding: '30px', borderRadius: '12px' }}>
            <h3>3. AI Sports Coach (LLM Integration)</h3>
            <input style={s.in} placeholder="Ask coaching question..." />
            <button style={{ ...s.btn, backgroundColor: '#3273dc' }} onClick={() => handleAction('coach')}>GET AI COACH PLAN</button>
            {data.coachA && <div style={s.res}><pre style={{ whiteSpace: 'pre-wrap' }}>{data.coachA}</pre></div>}
          </div>
        )}

        {tab === 'recruiter' && (
          <div style={{ background: '#1f1f1f', padding: '30px', borderRadius: '12px' }}>
            <h3>5. AI Recruiter Match System</h3>
            <button style={s.btn} onClick={() => handleAction('rec')}>FIND MATCHING ATHLETES</button>
            {data.matches.map(m => (
              <div key={m.id} style={{ padding: '15px', borderBottom: '1px solid #333' }}>
                <p><strong>{m.name}</strong> - Score: {m.ai_score}%</p>
                <p style={{ color: '#00d1b2' }}>{m.compatibility}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  in: { width: '100%', padding: '12px', background: '#2c2c2c', border: '1px solid #444', color: 'white', borderRadius: '6px', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '14px', background: '#00d1b2', border: 'none', color: 'white', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer', marginTop: '15px' },
  res: { marginTop: '20px', padding: '20px', backgroundColor: '#2c2c2c', borderRadius: '8px', borderLeft: '4px solid #00d1b2' }
};

export default App;