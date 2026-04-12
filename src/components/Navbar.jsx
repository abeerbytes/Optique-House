// components/Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Promotional Bar */}
      <div className="bg-black text-white py-2 px-4 text-center text-xs md:text-sm font-bold tracking-widest uppercase">
        Limited Time: Buy One Frame, Get the Second 50% Off + Free Shipping
      </div>

      {/* Main Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100 mmmm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo and Brand */}
      <Link 
  to="/" 
  className="flex items-center cursor-pointer"
  style={{maxWidth: "200px", minWidth: "100px", width: "200px"}}
>
  <img 
    src="./logo.png" 
    alt="Logo" 
    style={{width: "100%", height: "auto"}}
    className="object-contain"
  />
</Link>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex gap-8 font-semibold text-sm uppercase tracking-wider">
            <li><Link to="/" className="hover:text-blue-600 transition-colors">Home</Link></li>
            <li><Link to="/about" className="hover:text-blue-600 transition-colors">About</Link></li>
            <li><Link to="/contact" className="hover:text-blue-600 transition-colors">Contact</Link></li>
            <li><Link to="/product" className="hover:text-blue-600 transition-colors">Product</Link></li>
            <li><Link to="/cart" className="hover:text-blue-600 transition-colors">Cart</Link></li>
          </ul>

          <div className="flex items-center gap-6">
            <button className="hidden md:block hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <Link to="/cart">
              <button className="bg-black text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-800 transition-all">
                Cart (0)
              </button>
            </Link>
            {/* Mobile menu button */}
            <button 
              className="lg:hidden focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 py-4 px-6">
            <ul className="flex flex-col gap-4 font-semibold text-sm uppercase tracking-wider">
              <li><Link to="/" className="hover:text-blue-600 transition-colors block" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
              <li><Link to="/about" className="hover:text-blue-600 transition-colors block" onClick={() => setIsMenuOpen(false)}>About</Link></li>
              <li><Link to="/contact" className="hover:text-blue-600 transition-colors block" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
              <li><Link to="/product" className="hover:text-blue-600 transition-colors block" onClick={() => setIsMenuOpen(false)}>Product</Link></li>
              <li><Link to="/cart" className="hover:text-blue-600 transition-colors block" onClick={() => setIsMenuOpen(false)}>Cart</Link></li>
            </ul>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;