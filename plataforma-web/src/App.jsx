import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Resolver from './pages/Resolver';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/resolver" element={<Resolver />} />
        </Routes>
      </Router>
  );
}

export default App;
