import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Resolver from './pages/Resolver';
import Historial from './pages/Historial';
import Home from "./pages/Home";
import Temas from "./pages/Temas";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/resolver" element={<Resolver />} />
          <Route path="/historial" element={<Historial />} />
          <Route path="/home" element={<Home />} />
          <Route path="/temas" element={<Temas />} /> 
        </Routes>
      </Router>
  );
}

export default App;
