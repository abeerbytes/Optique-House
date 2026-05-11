// Cart.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
 useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // Load cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  // Update quantity
  const updateQuantity = (id, newQuantity, variantName, lensType) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cart.map(item => {
      // Check if same product, same variant, same lens type
      if (item.id === id && 
          item.selectedVariant?.colorName === variantName && 
          item.prescription?.lensType === lensType) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    // Dispatch event to update navbar cart badge
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Remove item
  const removeItem = (id, variantName, lensType) => {
    const updatedCart = cart.filter(item => 
      !(item.id === id && 
        item.selectedVariant?.colorName === variantName && 
        item.prescription?.lensType === lensType)
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    // Dispatch event to update navbar cart badge
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Helper to parse price from string or number
  const parsePrice = (price) => {
    if (!price) return 0;
    if (typeof price === 'number') return price;
    return parseFloat(String(price).replace(/,/g, '')) || 0;
  };

  // Get item price (prefer totalPrice, fallback to framePrice + lensExtraCharge, then discountPrice/originalPrice)
  const getItemPrice = (item) => {
    if (item.totalPrice) return item.totalPrice;
    if (item.framePrice !== undefined && item.lensExtraCharge !== undefined) {
      return item.framePrice + (item.lensExtraCharge || 0);
    }
    // Fallback for old cart items using discountPrice or originalPrice
    if (item.discountPrice) {
      return parsePrice(item.discountPrice);
    }
    if (item.originalPrice) {
      return parsePrice(item.originalPrice);
    }
    if (item.price) return item.price;
    return 0;
  };

  // Get frame price for display
  const getFramePrice = (item) => {
    if (item.framePrice !== undefined) return item.framePrice;
    if (item.discountPrice) return parsePrice(item.discountPrice);
    if (item.originalPrice) return parsePrice(item.originalPrice);
    return 0;
  };

  // Get lens extra charge
  const getLensExtraCharge = (item) => {
    return item.lensExtraCharge || item.prescription?.lensPrice || 0;
  };

  // Get subtotal
  const getSubtotal = () => {
    return cart.reduce((total, item) => {
      const price = getItemPrice(item);
      return total + (price * (item.quantity || 1));
    }, 0);
  };

  // Shipping cost (free over ₹5000)
  const getShipping = () => {
    return getSubtotal() > 5000 ? 0 : 200;
  };

  // Get total
  const getTotal = () => {
    return getSubtotal() + getShipping();
  };

  // Get category display name
  const getCategoryDisplay = (category) => {
    const categoryMap = {
      'men sunglass': 'Men\'s Sunglass',
      'men eyeglass': 'Men\'s Eyeglass',
      'woman sunglass': 'Women\'s Sunglass',
      'women eyeglass': 'Women\'s Eyeglass',
      'kid sunglass': 'Kids\' Sunglass',
      'kids eyeglass': 'Kids\' Eyeglass',
      'contactless': 'Contact Lens'
    };
    return categoryMap[category] || category || 'Optical';
  };

  const proceedToCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="cart-page">
      {/* Animated Background Elements */}
      <div className="animated-bg">
        <div className="bg-orb orb1"></div>
        <div className="bg-orb orb2"></div>
        <div className="bg-orb orb3"></div>
        <div className="bg-orb orb4"></div>
        <div className="lens-flare"></div>
        <div className="glint-overlay"></div>
      </div>
      
      <div className="container">
        <h1 className="cart-title">
          <span className="title-icon">👓</span> Shopping Cart
        </h1>
        
        {cart.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒✨</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any optical items yet</p>
            <Link to="/products" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items-section">
              <div className="cart-header">
                <div className="product-col">Product</div>
                <div className="price-col">Price</div>
                <div className="quantity-col">Quantity</div>
                <div className="total-col">Total</div>
                <div className="action-col"></div>
              </div>
              
              {cart.map((item, index) => {
                const framePrice = getFramePrice(item);
                const lensCharge = getLensExtraCharge(item);
                const price = getItemPrice(item);
                const itemTotal = price * (item.quantity || 1);
                // Create unique key for each cart item
                const uniqueKey = `${item.id}-${item.selectedVariant?.colorName || 'default'}-${item.prescription?.lensType || 'no-lens'}`;
                
                // Get the image from variant or item
                const itemImage = item.image || 
                  item.selectedVariant?.images?.[0] || 
                  item.selectedVariant?.image || 
                  'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=80&h=80&fit=crop';
                
                return (
                  <div key={uniqueKey} className="cart-item" style={{ animationDelay: `${index * 0.05}s` }}>
                    <div className="product-col">
                      <div className="product-info">
                        <img 
                          src={itemImage}
                          alt={item.name}
                          className="product-image"
                        />
                        <div className="product-details">
                          <h3 className="product-name">{item.name}</h3>
                          {item.code && (
                            <span className="product-sku">SKU: {item.code}</span>
                          )}
                          {item.category && (
                            <span className="product-category">{getCategoryDisplay(item.category)}</span>
                          )}
                          {item.selectedVariant && item.selectedVariant.colorName && (
                            <span className="product-meta">Color: {item.selectedVariant.colorName}</span>
                          )}
                          {item.shape && (
                            <span className="product-meta">Shape: {item.shape}</span>
                          )}
                          {item.type && (
                            <span className="product-meta">Type: {item.type}</span>
                          )}
                          {item.pattern && (
                            <span className="product-meta">Pattern: {item.pattern}</span>
                          )}
                          {item.prescription && (
                            <span className="product-prescription">
                              Lens: {item.prescription.lensName || item.prescription.lensType || 'Standard'} 
                              (+₹{parsePrice(item.prescription.lensPrice).toLocaleString()})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="price-col">
                      <span className="price">₹{price.toLocaleString()}</span>
                      {lensCharge > 0 && (
                        <span className="price-breakdown">
                          Frame: ₹{framePrice.toLocaleString()} + Lens: ₹{lensCharge.toLocaleString()}
                        </span>
                      )}
                      {item.discount && parseFloat(item.discount) > 0 && (
                        <span className="discount-badge">Save {item.discount}</span>
                      )}
                    </div>
                    
                    <div className="quantity-col">
                      <div className="quantity-selector">
                        <button 
                          className="qty-btn"
                          onClick={() => updateQuantity(
                            item.id, 
                            (item.quantity || 1) - 1,
                            item.selectedVariant?.colorName,
                            item.prescription?.lensType
                          )}
                        >
                          -
                        </button>
                        <input 
                          type="number" 
                          value={item.quantity || 1}
                          onChange={(e) => updateQuantity(
                            item.id, 
                            parseInt(e.target.value) || 1,
                            item.selectedVariant?.colorName,
                            item.prescription?.lensType
                          )}
                          min="1"
                          className="qty-input"
                        />
                        <button 
                          className="qty-btn"
                          onClick={() => updateQuantity(
                            item.id, 
                            (item.quantity || 1) + 1,
                            item.selectedVariant?.colorName,
                            item.prescription?.lensType
                          )}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div className="total-col">
                      <span className="item-total">₹{itemTotal.toLocaleString()}</span>
                    </div>
                    
                    <div className="action-col">
                      <button 
                        className="remove-btn"
                        onClick={() => removeItem(
                          item.id,
                          item.selectedVariant?.colorName,
                          item.prescription?.lensType
                        )}
                        aria-label="Remove item"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="cart-summary">
              <h2 className="summary-title">Order Summary</h2>
              
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{getSubtotal().toLocaleString()}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <span>{getShipping() === 0 ? 'Free' : `₹${getShipping().toLocaleString()}`}</span>
              </div>
              
              {getShipping() > 0 && getSubtotal() < 5000 && (
                <div className="shipping-note">
                  ✨ Add ₹{(5000 - getSubtotal()).toLocaleString()} more for free shipping
                </div>
              )}
              
              <div className="summary-total">
                <span>Total</span>
                <span>₹{getTotal().toLocaleString()}</span>
              </div>
              
              <button 
                className="checkout-btn"
                onClick={proceedToCheckout}
              >
                Proceed to Checkout
              </button>
              
              <Link to="/products" className="continue-shopping-link">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .cart-page {
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
          background: linear-gradient(135deg, #e8eef5 0%, #dce3ec 25%, #f0eef7 50%, #e2e8f0 100%);
          overflow: hidden;
        }
        
        .bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.5;
          animation: floatOrb 20s infinite alternate ease-in-out;
        }
        
        .orb1 {
          width: 55vw;
          height: 55vw;
          background: radial-gradient(circle, rgba(100, 130, 250, 0.35), rgba(160, 140, 255, 0.2));
          top: -15%;
          left: -10%;
          animation-duration: 24s;
        }
        
        .orb2 {
          width: 60vw;
          height: 60vw;
          background: radial-gradient(circle, rgba(255, 200, 100, 0.3), rgba(255, 140, 80, 0.15));
          bottom: -20%;
          right: -15%;
          animation-duration: 28s;
          animation-delay: -4s;
        }
        
        .orb3 {
          width: 45vw;
          height: 45vw;
          background: radial-gradient(circle, rgba(80, 180, 220, 0.3), rgba(100, 100, 240, 0.2));
          top: 40%;
          left: 60%;
          animation-duration: 32s;
          animation-delay: -7s;
        }
        
        .orb4 {
          width: 35vw;
          height: 35vw;
          background: radial-gradient(circle, rgba(200, 130, 250, 0.25), rgba(180, 100, 200, 0.15));
          bottom: 10%;
          left: 20%;
          animation-duration: 26s;
          animation-delay: -2s;
        }
        
        @keyframes floatOrb {
          0% {
            transform: translate(0, 0) scale(1);
          }
          100% {
            transform: translate(5%, 7%) scale(1.1);
          }
        }
        
        /* Lens flare & glint animation */
        .lens-flare {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,245,0.08) 0%, transparent 70%);
          animation: rotateFlare 30s linear infinite;
          pointer-events: none;
        }
        
        @keyframes rotateFlare {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .glint-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(125deg, transparent 30%, rgba(255,255,245,0.05) 50%, transparent 70%);
          animation: glintMove 12s ease-in-out infinite;
          pointer-events: none;
        }
        
        @keyframes glintMove {
          0% { transform: translateX(-100%) skewX(-15deg); }
          20% { transform: translateX(100%) skewX(-15deg); }
          100% { transform: translateX(100%) skewX(-15deg); }
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }
        
        .cart-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a1a2e;
          margin-bottom: 40px;
          text-align: center;
          animation: titleReveal 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        
        .title-icon {
          display: inline-block;
          animation: bounceIcon 2s ease-in-out infinite;
        }
        
        @keyframes bounceIcon {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(5deg); }
        }
        
        @keyframes titleReveal {
          0% {
            opacity: 0;
            transform: translateY(-25px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .empty-cart {
          text-align: center;
          padding: 80px 20px;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(8px);
          border-radius: 32px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
          transition: all 0.4s ease;
          animation: fadeInUp 0.5s ease-out;
        }
        
        .empty-cart:hover {
          transform: scale(1.01);
          box-shadow: 0 28px 48px rgba(0, 0, 0, 0.12);
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .empty-cart-icon {
          font-size: 85px;
          margin-bottom: 20px;
          animation: floatCart 2s ease-in-out infinite;
        }
        
        @keyframes floatCart {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .empty-cart h2 {
          font-size: 1.8rem;
          color: #1a1a2e;
          margin-bottom: 10px;
        }
        
        .empty-cart p {
          color: #4a5568;
          margin-bottom: 30px;
        }
        
        .continue-shopping-btn {
          display: inline-block;
          padding: 12px 32px;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          color: white;
          text-decoration: none;
          border-radius: 40px;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 6px 14px rgba(0, 0, 0, 0.1);
        }
        
        .continue-shopping-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
          background: linear-gradient(135deg, #16213e 0%, #0f172a 100%);
        }
        
        .cart-content {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 30px;
        }
        
        .cart-items-section {
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(6px);
          border-radius: 28px;
          padding: 24px;
          box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.12);
          transition: all 0.3s ease;
          animation: slideInLeft 0.5s ease-out;
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .cart-header {
          display: grid;
          grid-template-columns: 3fr 1fr 1.5fr 1fr 0.5fr;
          padding: 15px 0;
          border-bottom: 2px solid rgba(0, 0, 0, 0.08);
          font-weight: 600;
          color: #2c3e66;
          letter-spacing: 0.3px;
        }
        
        .cart-item {
          display: grid;
          grid-template-columns: 3fr 1fr 1.5fr 1fr 0.5fr;
          padding: 20px 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          align-items: center;
          transition: all 0.3s ease;
          animation: fadeSlideItem 0.45s cubic-bezier(0.2, 0.8, 0.4, 1) backwards;
        }
        
        @keyframes fadeSlideItem {
          from {
            opacity: 0;
            transform: translateX(-15px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .cart-item:hover {
          background: linear-gradient(90deg, rgba(245, 248, 255, 0.8), transparent);
          border-radius: 20px;
          padding-left: 12px;
          margin-left: -6px;
          transition: 0.2s;
        }
        
        .product-info {
          display: flex;
          gap: 15px;
          align-items: center;
        }
        
        .product-image {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 18px;
          box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }
        
        .product-image:hover {
          transform: scale(1.03) rotate(1deg);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
        }
        
        .product-details h3 {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 5px;
          color: #0f172a;
        }
        
        .product-sku {
          font-size: 0.7rem;
          color: #94a3b8;
          display: block;
          margin-bottom: 2px;
        }
        
        .product-category {
          font-size: 0.7rem;
          color: #667eea;
          background: #eef2ff;
          padding: 2px 8px;
          border-radius: 20px;
          display: inline-block;
          margin-bottom: 4px;
        }
        
        .product-meta {
          font-size: 0.75rem;
          color: #4b5563;
          display: block;
          margin-top: 2px;
        }
        
        .product-prescription {
          font-size: 0.7rem;
          color: #667eea;
          background: #eef2ff;
          padding: 2px 8px;
          border-radius: 20px;
          display: inline-block;
          margin-top: 4px;
        }
        
        .price, .item-total {
          font-weight: 700;
          color: #0f172a;
        }
        
        .price-breakdown {
          display: block;
          font-size: 0.7rem;
          font-weight: normal;
          color: #64748b;
          margin-top: 2px;
        }
        
        .discount-badge {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 600;
          color: #b91c1c;
          background: rgba(185, 28, 28, 0.1);
          padding: 2px 6px;
          border-radius: 20px;
          margin-top: 4px;
        }
        
        .quantity-selector {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .qty-btn {
          width: 34px;
          height: 34px;
          border: 1px solid #cbd5e1;
          background: white;
          border-radius: 12px;
          cursor: pointer;
          font-size: 1.2rem;
          font-weight: 600;
          transition: all 0.2s ease;
          color: #1e293b;
        }
        
        .qty-btn:hover {
          background: #eef2ff;
          transform: scale(1.05);
          border-color: #94a3b8;
        }
        
        .qty-btn:active {
          transform: scale(0.95);
        }
        
        .qty-input {
          width: 54px;
          height: 38px;
          text-align: center;
          border: 1px solid #cbd5e1;
          border-radius: 14px;
          font-size: 0.95rem;
          font-weight: 500;
          background: white;
          transition: all 0.2s;
        }
        
        .qty-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .remove-btn {
          background: none;
          border: none;
          font-size: 1.3rem;
          cursor: pointer;
          opacity: 0.5;
          transition: all 0.25s ease;
          padding: 8px;
          border-radius: 40px;
        }
        
        .remove-btn:hover {
          opacity: 1;
          transform: scale(1.12);
          background: #fee2e2;
        }
        
        .cart-summary {
          background: rgba(255, 255, 255, 0.97);
          backdrop-filter: blur(8px);
          border-radius: 28px;
          padding: 28px 24px;
          height: fit-content;
          position: sticky;
          top: 20px;
          box-shadow: 0 25px 45px -16px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
          animation: slideInRight 0.5s ease-out;
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .cart-summary:hover {
          transform: translateY(-4px);
        }
        
        .summary-title {
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 2px solid #e2e8f0;
          letter-spacing: -0.2px;
        }
        
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          color: #334155;
          transition: all 0.2s;
        }
        
        .summary-total {
          display: flex;
          justify-content: space-between;
          padding: 15px 0;
          margin-top: 10px;
          border-top: 2px solid #e2e8f0;
          font-size: 1.3rem;
          font-weight: 800;
          color: #0f172a;
        }
        
        .shipping-note {
          background: linear-gradient(135deg, #e6f9ed, #d4f5e0);
          padding: 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          color: #1e5c2e;
          margin: 12px 0;
          text-align: center;
          font-weight: 600;
          animation: pulseGlow 2s infinite;
        }
        
        @keyframes pulseGlow {
          0%, 100% { 
            background: linear-gradient(135deg, #e6f9ed, #d4f5e0);
            box-shadow: 0 0 0 0 rgba(30, 92, 46, 0.2);
          }
          50% { 
            background: linear-gradient(135deg, #d0f0dc, #c0e8d0);
            box-shadow: 0 0 0 4px rgba(30, 92, 46, 0.1);
          }
        }
        
        .checkout-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: white;
          border: none;
          border-radius: 44px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          margin-top: 20px;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
          letter-spacing: 0.5px;
        }
        
        .checkout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 28px rgba(0, 0, 0, 0.18);
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
        }
        
        .checkout-btn:active {
          transform: translateY(1px);
        }
        
        .continue-shopping-link {
          display: block;
          text-align: center;
          margin-top: 18px;
          color: #475569;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.25s ease;
        }
        
        .continue-shopping-link:hover {
          color: #0f172a;
          transform: translateX(-5px);
          display: inline-block;
          width: auto;
          margin-left: auto;
          margin-right: auto;
        }
        
        @media (max-width: 968px) {
          .cart-content {
            grid-template-columns: 1fr;
          }
          
          .cart-header {
            display: none;
          }
          
          .cart-item {
            grid-template-columns: 1fr;
            gap: 15px;
            text-align: center;
          }
          
          .product-info {
            flex-direction: column;
            text-align: center;
          }
          
          .quantity-selector {
            justify-content: center;
          }
          
          .price-col, .total-col, .action-col {
            text-align: center;
          }
          
          .cart-summary {
            position: static;
          }
          
          .cart-title {
            font-size: 2rem;
          }
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.05);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #1a1a2e, #2c3e66);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default Cart;