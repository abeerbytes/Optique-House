import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    notes: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const navigate = useNavigate();

  // ✅ YOUR UPDATED WEB APP URL
  const GOOGLE_SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwA7ZZ5cmYoThPi2SktBNVj_T6G7YbWWc1_YyacbZo1IiMapvVt8c4Qb5PY8pRZrUCE1w/exec";

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (savedCart.length === 0) {
      navigate("/cart");
    }
    setCart(savedCart);
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.discountPrice?.replace(/,/g, "")) || 0;
      return total + (price * (item.quantity || 1));
    }, 0);
  };

  const getShipping = () => {
    return getSubtotal() > 5000 ? 0 : 200;
  };

  const getTotal = () => {
    return getSubtotal() + getShipping();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.name || !form.phone || !form.address || !form.city) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    const orderData = {
      orderId: `ORD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      customerName: form.name,
      customerEmail: form.email,
      customerPhone: form.phone,
      deliveryAddress: `${form.address}, ${form.city}, ${form.zipCode}`,
      orderNotes: form.notes,
      paymentMethod: paymentMethod === "cod" ? "Cash on Delivery" : "Bank Transfer",
      items: cart.map(item => ({
        name: item.name,
        quantity: item.quantity || 1,
        price: item.discountPrice,
        total: (parseFloat(item.discountPrice?.replace(/,/g, "")) || 0) * (item.quantity || 1)
      })),
      subtotal: getSubtotal(),
      shipping: getShipping(),
      total: getTotal(),
      status: "Pending"
    };

    console.log("Sending order:", orderData);

    try {
      const response = await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData)
      });

      console.log("Order sent successfully!");

      const orders = JSON.parse(localStorage.getItem("orders")) || [];
      orders.push(orderData);
      localStorage.setItem("orders", JSON.stringify(orders));

      localStorage.removeItem("cart");

      alert(`✅ Order placed successfully!\nOrder ID: ${orderData.orderId}\nWe'll contact you shortly.`);
      navigate("/order-success", { state: { orderData } });
      
    } catch (err) {
      console.error("Error placing order:", err);
      alert("❌ Error placing order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      {/* Animated Background Elements */}
      <div className="animated-bg">
        <div className="bg-orb orb1"></div>
        <div className="bg-orb orb2"></div>
        <div className="bg-orb orb3"></div>
        <div className="bg-orb orb4"></div>
        <div className="light-sweep"></div>
        <div className="particle-field"></div>
      </div>
      
      <div className="container">
        <h1 className="checkout-title">
          <span className="title-icon">🔒</span> Secure Checkout
        </h1>
        
        <div className="checkout-content">
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-section">
              <h2>
                <span className="section-icon">👤</span>
                Contact Information
              </h2>
              
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className="animated-input"
                />
              </div>
              
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="animated-input"
                />
              </div>
              
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="0300 1234567"
                  className="animated-input"
                />
              </div>
            </div>
            
            <div className="form-section">
              <h2>
                <span className="section-icon">📍</span>
                Shipping Address
              </h2>
              
              <div className="form-group">
                <label>Address *</label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  rows="3"
                  placeholder="Street address, house number, etc."
                  className="animated-input"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                    placeholder="City"
                    className="animated-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={form.zipCode}
                    onChange={handleChange}
                    placeholder="ZIP Code"
                    className="animated-input"
                  />
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h2>
                <span className="section-icon">💳</span>
                Payment Method
              </h2>
              
              <div className="payment-options">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="payment-option-content">
                    <strong>Cash on Delivery</strong>
                    <span>Pay when you receive your order</span>
                  </div>
                </label>
                
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank"
                    checked={paymentMethod === "bank"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="payment-option-content">
                    <strong>Bank Transfer</strong>
                    <span>Pay via bank transfer</span>
                  </div>
                </label>
              </div>
            </div>
            
            <div className="form-section">
              <h2>
                <span className="section-icon">📝</span>
                Order Notes (Optional)
              </h2>
              <div className="form-group">
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Special instructions or delivery notes"
                  className="animated-input"
                />
              </div>
            </div>
          </form>
          
          <div className="order-summary">
            <h2>
              <span className="summary-icon">🛒</span>
              Order Summary
            </h2>
            
            <div className="summary-items">
              {cart.map((item, idx) => (
                <div key={item.id} className="summary-item" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">x{item.quantity || 1}</span>
                  </div>
                  <span className="item-price">
                    PKR {((parseFloat(item.discountPrice?.replace(/,/g, "")) || 0) * (item.quantity || 1)).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>PKR {getSubtotal().toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className={getShipping() === 0 ? "free-shipping" : ""}>
                  {getShipping() === 0 ? '✨ Free' : `PKR ${getShipping().toLocaleString()}`}
                </span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>PKR {getTotal().toLocaleString()}</span>
              </div>
            </div>
            
            <button 
              className="place-order-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <span className="loading-spinner">⏳ Placing Order...</span>
              ) : (
                "✅ Place Order"
              )}
            </button>
            
            <p className="secure-checkout">
              🔒 Secure checkout powered by SSL encryption
            </p>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .checkout-page {
          position: relative;
          min-height: 100vh;
          padding: 60px 0;
          overflow-x: hidden;
        }
        
        /* ========== ANIMATED BACKGROUND ========== */
        .animated-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -2;
          background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
          overflow: hidden;
        }
        
        .bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.4;
          animation: floatOrb 22s infinite alternate ease-in-out;
        }
        
        .orb1 {
          width: 60vw;
          height: 60vw;
          background: radial-gradient(circle, rgba(102, 126, 234, 0.5), rgba(118, 75, 162, 0.3));
          top: -20%;
          left: -15%;
          animation-duration: 25s;
        }
        
        .orb2 {
          width: 55vw;
          height: 55vw;
          background: radial-gradient(circle, rgba(237, 100, 166, 0.4), rgba(255, 140, 100, 0.25));
          bottom: -20%;
          right: -15%;
          animation-duration: 30s;
          animation-delay: -5s;
        }
        
        .orb3 {
          width: 45vw;
          height: 45vw;
          background: radial-gradient(circle, rgba(0, 255, 200, 0.25), rgba(0, 150, 255, 0.2));
          top: 45%;
          left: 55%;
          animation-duration: 28s;
          animation-delay: -8s;
        }
        
        .orb4 {
          width: 40vw;
          height: 40vw;
          background: radial-gradient(circle, rgba(255, 200, 50, 0.3), rgba(255, 100, 50, 0.2));
          bottom: 10%;
          left: 20%;
          animation-duration: 35s;
          animation-delay: -3s;
        }
        
        @keyframes floatOrb {
          0% {
            transform: translate(0, 0) scale(1);
          }
          100% {
            transform: translate(6%, 8%) scale(1.12);
          }
        }
        
        .light-sweep {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          animation: sweepLight 15s ease-in-out infinite;
          pointer-events: none;
        }
        
        @keyframes sweepLight {
          0% { left: -100%; }
          50% { left: 100%; }
          100% { left: 100%; }
        }
        
        .particle-field {
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(circle at 20% 40%, rgba(255,255,255,0.08) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: particleDrift 60s linear infinite;
          pointer-events: none;
        }
        
        @keyframes particleDrift {
          0% { background-position: 0 0; }
          100% { background-position: 200px 200px; }
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          position: relative;
          z-index: 1;
        }
        
        .checkout-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: 40px;
          text-align: center;
          animation: titleGlow 0.6s ease-out;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          text-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        
        .title-icon {
          display: inline-block;
          animation: pulseIcon 2s ease-in-out infinite;
        }
        
        @keyframes pulseIcon {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.9; }
        }
        
        @keyframes titleGlow {
          0% {
            opacity: 0;
            transform: translateY(-25px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .checkout-content {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 30px;
        }
        
        .checkout-form {
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(12px);
          border-radius: 32px;
          padding: 32px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          animation: slideInLeft 0.5s ease-out;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .checkout-form:hover {
          transform: translateY(-3px);
          box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.3);
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-25px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .form-section {
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          transition: all 0.2s;
        }
        
        .form-section:last-child {
          border-bottom: none;
        }
        
        .form-section h2 {
          font-size: 1.3rem;
          margin-bottom: 22px;
          color: #1a1a2e;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .section-icon {
          font-size: 1.4rem;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #1e293b;
          font-size: 0.9rem;
        }
        
        .animated-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          font-size: 1rem;
          transition: all 0.25s ease;
          background: white;
          font-family: inherit;
        }
        
        .animated-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.15);
          transform: scale(1.01);
        }
        
        .animated-input:hover {
          border-color: #cbd5e1;
        }
        
        textarea.animated-input {
          resize: vertical;
          font-family: inherit;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        
        .payment-options {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .payment-option {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 16px;
          border: 2px solid #e2e8f0;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.25s ease;
          background: white;
        }
        
        .payment-option:hover {
          border-color: #667eea;
          background: linear-gradient(135deg, #f8f9ff, #ffffff);
          transform: translateX(5px);
        }
        
        .payment-option input {
          margin: 0;
          width: 20px;
          height: 20px;
          accent-color: #667eea;
        }
        
        .payment-option-content {
          display: flex;
          flex-direction: column;
        }
        
        .payment-option-content strong {
          margin-bottom: 5px;
          color: #1a1a2e;
        }
        
        .payment-option-content span {
          font-size: 0.85rem;
          color: #64748b;
        }
        
        .order-summary {
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(12px);
          border-radius: 32px;
          padding: 32px;
          height: fit-content;
          position: sticky;
          top: 20px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          animation: slideInRight 0.5s ease-out;
          transition: all 0.3s ease;
        }
        
        .order-summary:hover {
          transform: translateY(-3px);
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(25px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .order-summary h2 {
          font-size: 1.4rem;
          margin-bottom: 22px;
          padding-bottom: 15px;
          border-bottom: 2px solid rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .summary-icon {
          font-size: 1.3rem;
        }
        
        .summary-items {
          margin-bottom: 20px;
          max-height: 320px;
          overflow-y: auto;
          scrollbar-width: thin;
        }
        
        .summary-items::-webkit-scrollbar {
          width: 5px;
        }
        
        .summary-items::-webkit-scrollbar-track {
          background: #e2e8f0;
          border-radius: 10px;
        }
        
        .summary-items::-webkit-scrollbar-thumb {
          background: #667eea;
          border-radius: 10px;
        }
        
        .summary-item {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          animation: fadeItem 0.4s ease backwards;
          transition: all 0.2s;
        }
        
        .summary-item:hover {
          background: rgba(102, 126, 234, 0.05);
          padding-left: 8px;
          border-radius: 12px;
        }
        
        @keyframes fadeItem {
          from {
            opacity: 0;
            transform: translateX(-8px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .item-info {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        
        .item-name {
          font-weight: 600;
          color: #1e293b;
        }
        
        .item-quantity {
          color: #64748b;
          font-size: 0.85rem;
          background: #f1f5f9;
          padding: 2px 8px;
          border-radius: 20px;
        }
        
        .item-price {
          font-weight: 700;
          color: #0f172a;
        }
        
        .summary-totals {
          padding-top: 15px;
          border-top: 2px solid rgba(0, 0, 0, 0.08);
        }
        
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          color: #475569;
          font-weight: 500;
        }
        
        .free-shipping {
          color: #10b981;
          font-weight: 600;
        }
        
        .summary-total {
          display: flex;
          justify-content: space-between;
          padding: 18px 0;
          margin-top: 10px;
          border-top: 2px solid rgba(0, 0, 0, 0.08);
          font-size: 1.3rem;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          color: #1a1a2e;
        }
        
        .place-order-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 44px;
          font-size: 1.05rem;
          font-weight: 700;
          cursor: pointer;
          margin-top: 20px;
          transition: all 0.3s ease;
          box-shadow: 0 10px 25px -8px rgba(102, 126, 234, 0.5);
          letter-spacing: 0.5px;
        }
        
        .place-order-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 20px 35px -10px rgba(102, 126, 234, 0.6);
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        }
        
        .place-order-btn:active:not(:disabled) {
          transform: translateY(1px);
        }
        
        .place-order-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
        
        .loading-spinner {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        
        .secure-checkout {
          text-align: center;
          margin-top: 18px;
          font-size: 0.85rem;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        
        @media (max-width: 968px) {
          .checkout-content {
            grid-template-columns: 1fr;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .checkout-title {
            font-size: 2rem;
          }
          
          .order-summary {
            position: static;
          }
        }
        
        /* Custom focus ring */
        input:focus, textarea:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default Checkout;