import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Account from './pages/Account'
import Wishlist from './pages/Wishlist'
import Editorial from './pages/Editorial'
import About from './pages/About'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Orders from './pages/Orders'
import VerifyEmail from './pages/VerifyEmail'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/men" element={<Shop category="Men" />} />
          <Route path="/women" element={<Shop category="Women" />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/editorial" element={<Editorial />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  )
}

export default App
