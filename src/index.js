import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Cart from './pages/Cart';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductDetails from './pages/ProductDitails';
import { ToastContainer } from 'react-toastify';
import Checkout from './pages/CheckOut';
import Recovery from './pages/Recovery';
import Shipping from './pages/Shipping';
import Contact from './pages/Contact';
import Allporducts from './pages/Allprouducts';
import Pageone from './AllPages/Pageone';
import Num1 from './AllPages/Page1';
import Num2 from './AllPages/2';
import Num3 from './AllPages/3';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/pageone" element={<Pageone />} />
          <Route path="/1" element={<Num1 />} />
          <Route path="/2" element={<Num2 />} />
          <Route path="/3" element={<Num3 />} />
          <Route path="/recovery" element={<Recovery />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/all" element={<Allporducts />} />
        </Routes>
        <ToastContainer position="bottom-center" autoClose={1000} />
      </Router>
  </React.StrictMode>
);

reportWebVitals();
