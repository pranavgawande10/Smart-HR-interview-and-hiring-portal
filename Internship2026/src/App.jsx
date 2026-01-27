import { Routes, Route } from 'react-router-dom';

import Dashboard from './HR_panel/pages/Dashboard';
import Jobposting from './HR_panel/pages/Jobposting';
import Applicants from './HR_panel/pages/Applicants';
import Interview from './HR_panel/pages/Interview';
import Profile from './HR_panel/pages/Profile';
import Notfound from './HR_panel/pages/Notfound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/jobs" element={<Jobposting />} />
      <Route path="/applicants" element={<Applicants />} />
      <Route path="/interviews" element={<Interview />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Notfound />} />
    </Routes>
  );
}

export default App;