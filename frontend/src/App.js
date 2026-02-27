import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "http://localhost:5000/api/athletes";

function App() {
  const [view, setView] = useState('register'); // 'register', 'coach', 'recruiter'
  const [formData, setFormData] = useState({ name: '', age: '', sport: 'Cricket', location: '', stats: '', achievements: '', video: '' });
  const [analysis, setAnalysis] = useState(null);
  const [coachQ, setCoachQ] = useState("");
  const [coachA, setCoachA] = useState("");
  const [matches, setMatches] = useState([]);
  const [filter, setFilter] = useState({ sport: 'Cricket', minScore: 70 });

  // 1. & 2. Athlete Registration & Profile System
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/register`, {
        ...formData, performance_stats: { data: formData.stats }
      });
      setAnalysis(res.data.analysis);
      alert("Profile Created & AI Analysis Complete!");
    } catch (err) { alert("Registration Failed. Check Backend/API Key."); }
  };

  // 3. AI Sports Coach
  const askCoach = async () => {
    try {
      const res = await axios.post(`${API_URL}/ask-coach`, { athlete_id: 1, question: coachQ });
      setCoachA(res.data.coach_advice);
    } catch (err) { alert("Coach Error."); }
  };

  // 5. AI Recruiter Match System
  const fetchMatches = async () => {
    try {
      const res = await axios.get(`${API_URL}/recruiters/matches?sport=${filter.sport}&min_score=${filter.minScore}`);
      setMatches(res.data);
    } catch (err) { alert("Match System Error."); }
  };

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h2 style={{color: 'white'}}>🏆 AI Sports Scout</h2>
        <div>
          <button onClick={() => setView('register')} style={styles.navBtn}>Register</button>
          <button onClick={() => setView('coach')} style={styles.navBtn}>AI Coach</button>
          <button onClick={() => setView('recruiter')} style={styles.navBtn}>Recruiters</button>
        </div>
      </nav>

      {view === 'register' && (
        <section style={styles.section}>
          <h2>Athlete Registration & AI Analyzer</h2>
          <form onSubmit={handleRegister} style={styles.form}>
            <input placeholder="Name" style={styles.input} onChange={e => setFormData({...formData, name: e.target.value})} required />
            <input type="number" placeholder="Age" style={styles.input} onChange={e => setFormData({...formData, age: e.target.value})} required />
            <select style={styles.input} onChange={e => setFormData({...formData, sport: e.target.value})}>
              {['Cricket', 'Football', 'Basketball', 'Athletics', 'Kabaddi', 'Volleyball', 'Tennis', 'Badminton'].map(s => <option key={s}>{s}</option>)}
            </select>
            <input placeholder="Location" style={styles.input} onChange={e => setFormData({...formData, location: e.target.value})} />
            <textarea placeholder="Performance Stats (e.g. 100m in 11s)" style={styles.input} onChange={e => setFormData({...formData, stats: e.target.value})} />
            <button type="submit" style={styles.actionBtn}>Analyze & Save</button>
          </form>
          {analysis && <div style={styles.result}><h3>AI Analysis Result:</h3><p>{analysis}</p></div>}
        </section>
      )}

      {view === 'coach' && (
        <section style={styles.section}>
          <h2>AI Sports Coach</h2>
          <input placeholder="Ask about training, diet, or drills..." style={styles.input} onChange={e => setCoachQ(e.target.value)} />
          <button onClick={askCoach} style={styles.actionBtn}>Get Professional Advice</button>
          {coachA && <div style={styles.result}><h3>Coach Plan:</h3><pre style={{whiteSpace: 'pre-wrap'}}>{coachA}</pre></div>}
        </section>
      )}

      {view === 'recruiter' && (
        <section style={styles.section}>
          <h2>Recruiter Match System</h2>
          <select style={styles.input} onChange={e => setFilter({...filter, sport: e.target.value})}>
            {['Cricket', 'Football', 'Basketball', 'Athletics', 'Kabaddi'].map(s => <option key={s}>{s}</option>)}
          </select>
          <button onClick={fetchMatches} style={styles.actionBtn}>Find Top Athletes</button>
          <div style={{marginTop: '20px'}}>
            {matches.map(m => (
              <div key={m.id} style={styles.matchCard}>
                <h4>{m.name} ({m.sport})</h4>
                <p>AI Score: {m.ai_score}%</p>
                <p><em>{m.compatibility}</em></p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

const styles = {
  container: { fontFamily: 'Segoe UI', backgroundColor: '#f0f2f5', minHeight: '100vh' },
  nav: { display: 'flex', justifyContent: 'space-between', padding: '10px 50px', backgroundColor: '#1a73e8', alignItems: 'center' },
  navBtn: { background: 'none', border: 'none', color: 'white', marginLeft: '20px', cursor: 'pointer', fontSize: '16px' },
  section: { maxWidth: '900px', margin: '40px auto', padding: '30px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  form: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  input: { padding: '12px', border: '1px solid #ddd', borderRadius: '4px', width: '100%', boxSizing: 'border-box' },
  actionBtn: { padding: '12px', backgroundColor: '#1a73e8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' },
  result: { marginTop: '20px', padding: '20px', backgroundColor: '#e8f0fe', borderRadius: '4px', borderLeft: '5px solid #1a73e8' },
  matchCard: { padding: '15px', borderBottom: '1px solid #eee' }
};

export default App;