// OrderSuccess.jsx
import React from "react";
import { useLocation, Link } from "react-router-dom";

const OrderSuccess = () => {
  const location = useLocation();
  const { orderData } = location.state || {};

  if (!orderData) {
    return (
      <div className="order-success-page">
        <div className="container">
          <div className="success-card">
            <h1>Order Placed Successfully!</h1>
            <Link to="/products" className="continue-btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-success-page">
      <div className="container">
        <div className="success-card">
          <div className="success-icon">✅</div>
          <h1>Thank You for Your Order!</h1>
          <p className="order-id">Order ID: {orderData.orderId}</p>
          
          <div className="order-details">
            <h3>Order Summary</h3>
            <div className="details-grid">
              <div className="detail-item">
                <strong>Name:</strong> {orderData.customerName}
              </div>
              <div className="detail-item">
                <strong>Phone:</strong> {orderData.customerPhone}
              </div>
              <div className="detail-item">
                <strong>Address:</strong> {orderData.deliveryAddress}
              </div>
              <div className="detail-item">
                <strong>Payment Method:</strong> {orderData.paymentMethod}
              </div>
              <div className="detail-item">
                <strong>Total Amount:</strong> PKR {orderData.total.toLocaleString()}
              </div>
            </div>
          </div>
          
          <div className="next-steps">
            <h3>What's Next?</h3>
            <ul>
              <li>📞 Our team will contact you within 24 hours to confirm your order</li>
              <li>🚚 Delivery will take 3-5 business days</li>
              <li>💰 Cash on delivery available</li>
              <li>🔄 7-day return policy</li>
            </ul>
          </div>
          
          <div className="action-buttons">
            <Link to="/products" className="continue-btn">
              Continue Shopping
            </Link>
            <Link to="/" className="home-btn">
              Go to Home
            </Link>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .order-success-page {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          padding: 60px 0;
          display: flex;
          align-items: center;
        }
        
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 0 24px;
          width: 100%;
        }
        
        .success-card {
          background: white;
          border-radius: 20px;
          padding: 40px;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }
        
        .success-icon {
          font-size: 80px;
          margin-bottom: 20px;
        }
        
        h1 {
          font-size: 2rem;
          color: #1a1a2e;
          margin-bottom: 10px;
        }
        
        .order-id {
          font-size: 1.1rem;
          color: #667eea;
          font-weight: 600;
          margin-bottom: 30px;
        }
        
        .order-details {
          text-align: left;
          background: #f8f9fa;
          padding: 20px;
          border-radius: 10px;
          margin: 20px 0;
        }
        
        .order-details h3 {
          margin-bottom: 15px;
          color: #1a1a2e;
        }
        
        .details-grid {
          display: grid;
          gap: 10px;
        }
        
        .detail-item {
          font-size: 0.95rem;
        }
        
        .next-steps {
          text-align: left;
          margin: 20px 0;
        }
        
        .next-steps h3 {
          margin-bottom: 15px;
          color: #1a1a2e;
        }
        
        .next-steps ul {
          list-style: none;
          padding: 0;
        }
        
        .next-steps li {
          padding: 8px 0;
          color: #666;
        }
        
        .action-buttons {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-top: 30px;
        }
        
        .continue-btn, .home-btn {
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s;
        }
        
        .continue-btn {
          background: #1a1a2e;
          color: white;
        }
        
        .continue-btn:hover {
          background: #16213e;
          transform: translateY(-2px);
        }
        
        .home-btn {
          background: #f0f0f0;
          color: #333;
        }
        
        .home-btn:hover {
          background: #e0e0e0;
        }
        
        @media (max-width: 768px) {
          .success-card {
            padding: 30px 20px;
          }
          
          .action-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderSuccess;