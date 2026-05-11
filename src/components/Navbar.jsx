// components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const [cartCount, setCartCount] = useState(0); // ← NEW: cart badge count
  const location = useLocation();
  const navigate = useNavigate();

  // Load cart count from localStorage
  const loadCartCount = () => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = savedCart.reduce((total, item) => total + (item.quantity || 1), 0);
    setCartCount(totalItems);
    return totalItems;
  };

  // Scroll shadow effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cart bounce on mount / route change
  useEffect(() => {
    setCartBounce(true);
    const t = setTimeout(() => setCartBounce(false), 600);
    return () => clearTimeout(t);
  }, [location.pathname]);

  // Load cart count on mount and listen for changes
  useEffect(() => {
    // Initial load
    loadCartCount();

    // Listen for storage events (if cart updated in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'cart') {
        loadCartCount();
        setCartBounce(true);
        setTimeout(() => setCartBounce(false), 600);
      }
    };

    // Custom event for cart updates (dispatch from Cart.jsx or product pages)
    const handleCartUpdate = () => {
      loadCartCount();
      setCartBounce(true);
      setTimeout(() => setCartBounce(false), 600);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const navLinks = [
    { to: '/',        label: 'Home'    },
    { to: '/about',   label: 'About'   },
    { to: '/products', label: 'Products'},
    { to: '/contact', label: 'Contact' },
  ];

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  // Handle search icon click
  const handleSearchClick = () => {
    navigate('/products', { state: { focusSearch: true } });
  };

  return (
    <>
      <style>{`
        /* ── Promo bar ── */
        .promo-bar {
          background: #0a0a0a;
          color: #fff;
          text-align: center;
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          font-weight: 700;
          text-transform: uppercase;
          padding: 9px 16px;
          font-family: 'DM Sans', sans-serif;
        }
        .promo-bar span { color: #f5c842; margin: 0 4px; }

        /* ── Main nav ── */
        .navbar {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(255,255,255,0.96);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid #ebebeb;
          transition: box-shadow 0.3s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .navbar.scrolled { box-shadow: 0 4px 24px rgba(0,0,0,0.08); }

        .nav-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 32px;
          height: 68px;
          display: grid;
          grid-template-columns: 200px 1fr auto;
          align-items: center;
          gap: 24px;
        }

        /* ── Logo ── */
        .nav-logo { display: flex; align-items: center; }
        .nav-logo img { width: 160px; height: auto; object-fit: contain; display: block; }

        /* ── Desktop links ── */
        .nav-links {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 4px;
          list-style: none;
          margin: 0; padding: 0;
        }
        .nav-links li a {
          display: inline-block;
          padding: 8px 16px;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #1a1a1a;
          text-decoration: none;
          border-radius: 8px;
          position: relative;
          transition: color 0.2s;
        }
        .nav-links li a::after {
          content: '';
          position: absolute;
          bottom: 4px; left: 16px; right: 16px;
          height: 2px;
          background: #1a1a1a;
          border-radius: 1px;
          transform: scaleX(0);
          transition: transform 0.25s cubic-bezier(.4,0,.2,1);
        }
        .nav-links li a:hover { color: #000; }
        .nav-links li a:hover::after { transform: scaleX(1); }
        .nav-links li a.active { color: #000; }
        .nav-links li a.active::after { transform: scaleX(1); }

        /* ── Right actions ── */
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        /* Search icon button */
        .icon-btn {
          width: 40px; height: 40px;
          display: flex; align-items: center; justify-content: center;
          border: none; background: transparent;
          border-radius: 10px;
          cursor: pointer;
          color: #1a1a1a;
          transition: background 0.2s, transform 0.2s;
        }
        .icon-btn:hover { background: #f3f3f3; transform: scale(1.08); }

        /* Cart button */
        .cart-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #0a0a0a;
          color: #fff;
          border: none;
          padding: 0 18px;
          height: 40px;
          border-radius: 20px;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
          position: relative;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }
        .cart-btn:hover {
          background: #222;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.18);
        }
        .cart-btn:active { transform: translateY(0); }

        /* Cart icon */
        .cart-icon-wrap {
          position: relative;
          display: flex; align-items: center; justify-content: center;
        }
        .cart-icon-wrap svg { transition: transform 0.3s cubic-bezier(.34,1.56,.64,1); }
        .cart-btn:hover .cart-icon-wrap svg { transform: rotate(-12deg) scale(1.15); }

        /* Cart badge */
        .cart-badge {
          position: absolute;
          top: -6px; right: -7px;
          min-width: 16px;
          height: 16px;
          background: #f5c842;
          color: #0a0a0a;
          border-radius: 50%;
          font-size: 0.6rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 3px;
          border: 2px solid #0a0a0a;
          box-sizing: content-box;
        }

        /* Bounce animation for cart */
        @keyframes cartBounce {
          0%   { transform: scale(1); }
          30%  { transform: scale(1.3) rotate(-8deg); }
          60%  { transform: scale(0.92) rotate(4deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        .cart-bounce svg { animation: cartBounce 0.55s cubic-bezier(.36,.07,.19,.97); }

        /* Mobile hamburger */
        .hamburger {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 40px; height: 40px;
          border: none; background: transparent;
          border-radius: 10px;
          cursor: pointer;
          padding: 8px;
          transition: background 0.2s;
        }
        .hamburger:hover { background: #f3f3f3; }
        .hamburger span {
          display: block;
          height: 2px;
          background: #1a1a1a;
          border-radius: 2px;
          transition: transform 0.3s, opacity 0.3s, width 0.3s;
        }
        .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* ── Mobile dropdown ── */
        .mobile-menu {
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.38s cubic-bezier(.4,0,.2,1), opacity 0.3s;
          opacity: 0;
          background: #fff;
          border-top: 1px solid #f0f0f0;
        }
        .mobile-menu.open { max-height: 400px; opacity: 1; }
        .mobile-menu-inner {
          padding: 12px 32px 20px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .mobile-menu-inner a {
          display: block;
          padding: 11px 0;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #1a1a1a;
          text-decoration: none;
          border-bottom: 1px solid #f5f5f5;
          transition: color 0.2s, padding-left 0.2s;
        }
        .mobile-menu-inner a:hover { color: #000; padding-left: 8px; }
        .mobile-menu-inner a.active { color: #000; font-weight: 800; }
        .mobile-cart-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-top: 14px;
        }

        /* ── Responsive ── */
        @media (max-width: 1023px) {
          .nav-links { display: none !important; }
          .hamburger { display: flex !important; }
          .nav-inner { grid-template-columns: 160px 1fr auto; padding: 0 20px; }
        }
        @media (max-width: 639px) {
          .search-desktop { display: none !important; }
          .nav-inner { padding: 0 16px; height: 60px; }
        }
      `}</style>

      {/* Promotional Bar */}
      <div className="promo-bar">
        🎁 Limited Time: Buy All Items And Get upto<span>70% Off</span>+ Free Shipping On 5000+Pkr order
      </div>

      {/* Main Navigation */}
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-inner">

          {/* Logo */}
          <Link to="/" className="nav-logo">
            <img src="./logo.png" alt="Logo" />
          </Link>

          {/* Desktop Nav Links */}
          <ul className="nav-links">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className={isActive(to) ? 'active' : ''}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Actions */}
          <div className="nav-actions">
            {/* Search button with navigation */}
            <button
              className="icon-btn search-desktop"
              title="Search"
              onClick={handleSearchClick}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2"
                  d="M21 21l-5.2-5.2M16.5 10.5a6 6 0 11-12 0 6 6 0 0112 0z" />
              </svg>
            </button>

            {/* Cart button with dynamic badge */}
            <Link to="/cart" style={{ textDecoration: 'none' }}>
              <button className={`cart-btn${cartBounce ? ' cart-bounce' : ''}`}>
                <span className="cart-icon-wrap">
                  <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2"
                      d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" strokeWidth="2.2" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2"
                      d="M16 10a4 4 0 01-8 0" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>
                  )}
                </span>
                Cart
              </button>
            </Link>

            {/* Hamburger */}
            <button
              className={`hamburger${isMenuOpen ? ' open' : ''}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu${isMenuOpen ? ' open' : ''}`}>
          <div className="mobile-menu-inner">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={isActive(to) ? 'active' : ''}
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            <div className="mobile-cart-row">
              <Link to="/cart" style={{ textDecoration: 'none', flex: 1 }}
                onClick={() => setIsMenuOpen(false)}>
                <button className="cart-btn" style={{ width: '100%', justifyContent: 'center' }}>
                  <span className="cart-icon-wrap">
                    <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2"
                        d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" strokeWidth="2.2" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2"
                        d="M16 10a4 4 0 01-8 0" />
                    </svg>
                    {cartCount > 0 && (
                      <span className="cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>
                    )}
                  </span>
                  View Cart
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;