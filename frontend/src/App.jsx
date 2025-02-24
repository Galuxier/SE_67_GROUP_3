import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RegisterForm from './pages/Register';
import AddShop from "./pages/Shop/AddShop";
import AddProduct from "./pages/Shop/AddProduct";
import Summary from "./pages/Shop/Summary";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/addShop" element={<AddShop />} />
        <Route path="/addProduct" element={<AddProduct />} />
        <Route path="/summary" element={<Summary />} />
      </Routes>
    </Router>
  );
}

export default App;