import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Brief from './Pages/Brief';
import Products from './Pages/Products';  
import About from './Pages/About';  
import SignUp from './Pages/SignUp'
import Login from './Pages/Login'
import Cart from './Pages/Cart'
import Orders from './Pages/Orders'
import Profile from './Pages/Profile'
import Checkout from './Pages/Checkout'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/brief" element={<Brief />} />
        <Route path="/products" element={<Products />} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </Router>
  );
}

export default App;
