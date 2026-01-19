import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AgentActivity from './pages/onboarding/AgentActivity';
import CommandCenter from './pages/onboarding/CommandCenter';
import OnBoarding from './pages/onboarding/OnBoarding';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<OnBoarding />} />
          <Route path="/activity" element={<AgentActivity />} />
          <Route path="/dashboard" element={<CommandCenter />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
