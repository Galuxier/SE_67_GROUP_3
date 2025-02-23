import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import RegisterForm from './pages/register';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterForm />} />
      </Routes>
    </Router>
  );
}

export default App;