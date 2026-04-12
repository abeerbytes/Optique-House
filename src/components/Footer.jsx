// components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className=" text-black pt-24 pb-12 px-6 mmm" style={{background:"white"}}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
        <div>
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
          <p className="text-gray-400 leading-relaxed">
            Redefining vision through innovation and Italian design since 1998.
          </p>
          <div className="flex gap-4 mt-8">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
              FB
            </div>
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors cursor-pointer">
              IG
            </div>
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors cursor-pointer">
              TW
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-8">Shop Categories</h4>
          <ul className="space-y-4 text-gray-400">
            <li className="hover:text-black cursor-pointer transition-colors">Men's Frames</li>
            <li className="hover:text-black cursor-pointer transition-colors">Women's Frames</li>
            <li className="hover:text-black cursor-pointer transition-colors">Kids' Collection</li>
            <li className="hover:text-black cursor-pointer transition-colors">Blue Light Glasses</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-8">Customer Support</h4>
          <ul className="space-y-4 text-gray-400">
            <li className="hover:text-black cursor-pointer transition-colors">Shipping & Returns</li>
            <li className="hover:text-black cursor-pointer transition-colors">Track Order</li>
            <li className="hover:text-black cursor-pointer transition-colors">Prescription Guide</li>
            <li className="hover:text-black cursor-pointer transition-colors">FAQ</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-8">Our Showroom</h4>
          <p className="text-gray-400 mb-4">
            123 Fashion Ave,<br />
            New York, NY 10001
          </p>
          <p className="text-gray-400">
            Mon-Sat: 9am - 8pm<br />
            Sun: Closed
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
        <p>© 2026 Lumina Optical Luxury. All rights reserved.</p>
        <div className="flex gap-8">
          <span className="hover:text-black cursor-pointer">Privacy Policy</span>
          <span className="hover:text-black cursor-pointer">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;