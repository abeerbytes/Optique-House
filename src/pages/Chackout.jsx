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

  // ✅ YOUR GOOGLE SHEETS WEBHOOK URL
// ✅ YOUR GOOGLE SHEETS WEBHOOK URL (UPDATED)
const GOOGLE_SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbypumtAXRdstYULB-36zGuwuOnu9c-TUP2JfKQvnIySCCXDo8Srai7Lc7boBLG4XRyYXA/exec";

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    console.log("Cart loaded:", savedCart); // Debug: check cart structure
    if (savedCart.length === 0) {
      navigate("/cart");
    }
    setCart(savedCart);
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Get item price (supports multiple price formats)
  const getItemPrice = (item) => {
    if (item.totalPrice) return item.totalPrice;
    if (item.framePrice !== undefined && item.lensExtraCharge !== undefined) {
      return item.framePrice + (item.lensExtraCharge || 0);
    }
    if (item.discountPrice) {
      const price = typeof item.discountPrice === 'string' 
        ? parseFloat(item.discountPrice.replace(/,/g, "")) 
        : item.discountPrice;
      return price || 0;
    }
    if (item.price) return item.price;
    return 0;
  };

  // ✅ Helper function to format prescription value
  const formatPrescriptionValue = (value) => {
    if (!value || value === "" || value === null || value === undefined) {
      return "—";
    }
    return value;
  };

  // ✅ Helper function to display prescription details
  const getPrescriptionDisplay = (prescription) => {
    if (!prescription) return null;
    
    const leftEye = prescription.leftEye || {};
    const rightEye = prescription.rightEye || {};
    
    return {
      lensName: prescription.lensName || prescription.lensType || "Standard",
      lensPrice: prescription.lensPrice || 0,
      left: {
        sphere: formatPrescriptionValue(leftEye.sphere),
        cylinder: formatPrescriptionValue(leftEye.cylinder),
        axis: formatPrescriptionValue(leftEye.axis),
        baseCurve: formatPrescriptionValue(leftEye.baseCurve),
        diameter: formatPrescriptionValue(leftEye.diameter)
      },
      right: {
        sphere: formatPrescriptionValue(rightEye.sphere),
        cylinder: formatPrescriptionValue(rightEye.cylinder),
        axis: formatPrescriptionValue(rightEye.axis),
        baseCurve: formatPrescriptionValue(rightEye.baseCurve),
        diameter: formatPrescriptionValue(rightEye.diameter)
      }
    };
  };

  // Calculate subtotal
  const getSubtotal = () => {
    return cart.reduce((total, item) => {
      const price = getItemPrice(item);
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

    // Prepare order data with prescription per item
    const orderData = {
      orderId: `ORD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      customerName: form.name,
      customerEmail: form.email,
      customerPhone: form.phone,
      deliveryAddress: `${form.address}, ${form.city}, ${form.zipCode}`,
      orderNotes: form.notes,
      paymentMethod: paymentMethod === "cod" ? "Cash on Delivery" : "Bank Transfer",
      items: cart.map(item => {
        const price = getItemPrice(item);
        const quantity = item.quantity || 1;
        const prescription = item.prescription || null;
        
        return {
          name: item.name,
          variant: item.selectedVariant?.colorName || "Default",
          quantity: quantity,
          framePrice: item.framePrice || price,
          lensExtraCharge: item.lensExtraCharge || 0,
          lensType: prescription?.lensName || prescription?.lensType || "Standard",
          totalPrice: price,
          total: price * quantity,
          prescription: prescription ? {
            lensType: prescription.lensType || "standard",
            lensName: prescription.lensName || "Standard Lenses",
            lensPrice: prescription.lensPrice || 0,
            leftEye: {
              sphere: prescription.leftEye?.sphere || "",
              cylinder: prescription.leftEye?.cylinder || "",
              axis: prescription.leftEye?.axis || "",
              baseCurve: prescription.leftEye?.baseCurve || "",
              diameter: prescription.leftEye?.diameter || ""
            },
            rightEye: {
              sphere: prescription.rightEye?.sphere || "",
              cylinder: prescription.rightEye?.cylinder || "",
              axis: prescription.rightEye?.axis || "",
              baseCurve: prescription.rightEye?.baseCurve || "",
              diameter: prescription.rightEye?.diameter || ""
            }
          } : null
        };
      }),
      subtotal: getSubtotal(),
      shipping: getShipping(),
      total: getTotal(),
      status: "Pending"
    };

    console.log("Sending order:", orderData);

    try {
      await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData)
      });

      console.log("Order sent (no-cors mode - request accepted)");

      const orders = JSON.parse(localStorage.getItem("orders")) || [];
      orders.push(orderData);
      localStorage.setItem("orders", JSON.stringify(orders));

      localStorage.removeItem("cart");

      alert(`✅ Order placed successfully!\nOrder ID: ${orderData.orderId}\nWe'll contact you shortly.`);
      navigate("/order-success", { state: { orderData } });

    } catch (err) {
      console.error("Fetch error:", err);
      const orders = JSON.parse(localStorage.getItem("orders")) || [];
      orders.push(orderData);
      localStorage.setItem("orders", JSON.stringify(orders));
      localStorage.removeItem("cart");
      alert(`⚠️ Order saved locally. We'll process it soon.\nOrder ID: ${orderData.orderId}`);
      navigate("/order-success", { state: { orderData } });
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
            {/* Contact Information */}
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

            {/* Shipping Address */}
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

            {/* Payment Method */}
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

            {/* Order Notes */}
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

            <button type="submit" className="place-order-btn" disabled={loading}>
              {loading ? "⏳ Placing Order..." : "✅ Place Order"}
            </button>
          </form>

          {/* Order Summary */}
          <div className="order-summary">
            <h2>
              <span className="summary-icon">🛒</span>
              Order Summary
            </h2>
            <div className="summary-items">
              {cart.map((item, idx) => {
                const price = getItemPrice(item);
                const quantity = item.quantity || 1;
                const total = price * quantity;
                const framePrice = item.framePrice || price;
                const lensCharge = item.lensExtraCharge || 0;
                const prescriptionDisplay = getPrescriptionDisplay(item.prescription);
                
                return (
                  <div
                    key={`${item.id}-${item.selectedVariant?.colorName || idx}-${item.prescription?.lensType || 'no-lens'}`}
                    className="summary-item"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <div className="item-main">
                      <div className="item-info">
                        <span className="item-name">{item.name}</span>
                        {item.selectedVariant && (
                          <span className="item-variant">({item.selectedVariant.colorName})</span>
                        )}
                        <span className="item-quantity">x{quantity}</span>
                      </div>
                      <div className="item-price">₹{total.toLocaleString()}</div>
                    </div>
                    
                    {/* Show price breakdown */}
                    {lensCharge > 0 && (
                      <div className="price-breakdown">
                        Frame: ₹{framePrice.toLocaleString()} + Lens: ₹{lensCharge.toLocaleString()}
                      </div>
                    )}
                    
                    {/* Display prescription if present */}
                    {prescriptionDisplay && (
                      <div className="item-prescription">
                        <div className="prescription-header">
                          <strong>👓 Lens:</strong> {prescriptionDisplay.lensName} (+₹{prescriptionDisplay.lensPrice.toLocaleString()})
                        </div>
                        <div className="prescription-details">
                          <div className="eye-column">
                            <div className="eye-title">👁️ Left Eye</div>
                            <div className="prescription-row">
                              <span>SPH:</span> {prescriptionDisplay.left.sphere}
                              <span>CYL:</span> {prescriptionDisplay.left.cylinder}
                              <span>Axis:</span> {prescriptionDisplay.left.axis}
                            </div>
                            <div className="prescription-row">
                              <span>BC:</span> {prescriptionDisplay.left.baseCurve}
                              <span>DIA:</span> {prescriptionDisplay.left.diameter}
                            </div>
                          </div>
                          <div className="eye-column">
                            <div className="eye-title">👁️ Right Eye</div>
                            <div className="prescription-row">
                              <span>SPH:</span> {prescriptionDisplay.right.sphere}
                              <span>CYL:</span> {prescriptionDisplay.right.cylinder}
                              <span>Axis:</span> {prescriptionDisplay.right.axis}
                            </div>
                            <div className="prescription-row">
                              <span>BC:</span> {prescriptionDisplay.right.baseCurve}
                              <span>DIA:</span> {prescriptionDisplay.right.diameter}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{getSubtotal().toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className={getShipping() === 0 ? "free-shipping" : ""}>
                  {getShipping() === 0 ? "✨ Free" : `₹${getShipping().toLocaleString()}`}
                </span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>₹{getTotal().toLocaleString()}</span>
              </div>
            </div>

            <p className="secure-checkout">🔒 Secure checkout powered by SSL encryption</p>
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

        /* Animated Background */
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
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
          animation: sweepLight 15s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes sweepLight {
          0% {
            left: -100%;
          }
          50% {
            left: 100%;
          }
          100% {
            left: 100%;
          }
        }

        .particle-field {
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(circle at 20% 40%, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: particleDrift 60s linear infinite;
          pointer-events: none;
        }

        @keyframes particleDrift {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 200px 200px;
          }
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
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .title-icon {
          display: inline-block;
          animation: pulseIcon 2s ease-in-out infinite;
        }

        @keyframes pulseIcon {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.9;
          }
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
          max-height: 400px;
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

        .item-main {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 8px;
        }

        .item-info {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          align-items: baseline;
        }

        .item-name {
          font-weight: 700;
          color: #1e293b;
        }

        .item-variant {
          font-size: 0.8rem;
          color: #667eea;
          background: #eef2ff;
          padding: 2px 8px;
          border-radius: 20px;
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

        .price-breakdown {
          font-size: 0.7rem;
          color: #64748b;
          margin-top: 4px;
          padding-left: 8px;
        }

        .item-prescription {
          margin-top: 8px;
          background: #f8fafc;
          border-radius: 12px;
          padding: 10px;
          border-left: 3px solid #667eea;
        }

        .prescription-header {
          font-size: 0.75rem;
          color: #1e293b;
          margin-bottom: 8px;
          padding-bottom: 6px;
          border-bottom: 1px solid #e2e8f0;
        }

        .prescription-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .eye-column {
          font-size: 0.7rem;
        }

        .eye-title {
          font-weight: 600;
          color: #667eea;
          margin-bottom: 4px;
        }

        .prescription-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          color: #475569;
        }

        .prescription-row span {
          font-weight: 600;
          color: #334155;
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
          .prescription-row {
            gap: 6px;
          }
        }
      `}</style>
    </div>
  );
};

export default Checkout;