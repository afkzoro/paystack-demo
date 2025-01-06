import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PaystackCheckout from './components/PaystackCheckout';
import PaymentSuccess from './components/PaymentSuccess';
import PaymentFailure from './components/PaymentFailure';

function App() {
  return (
    <Router basename="/">
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<PaystackCheckout />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/failure" element={<PaymentFailure />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;