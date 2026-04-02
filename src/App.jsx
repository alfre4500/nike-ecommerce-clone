import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import CartDrawer from './components/cart/CartDrawer';
import Toast from './components/ui/Toast';
import SearchModal from './components/ui/SearchModal';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Catalog from './pages/Catalog';

export default function App() {
  return (
    <Router>
      <Header />
      <CartDrawer />
      <Toast />
      <SearchModal />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/producto/:id" element={<ProductDetails />} />
        <Route path="/catalogo" element={<Catalog />} /> {/* 2. AGREGAMOS LA RUTA */}
      </Routes>
    </Router>
  );
}