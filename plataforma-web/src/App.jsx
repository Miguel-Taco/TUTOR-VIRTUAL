import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Resolver from './pages/Resolver';
import Home from "./pages/Home";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/resolver" element={<Resolver />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
  );
}

export default App;
