import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  // Default to the first variant
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);

  return (
    <div className="max-w-[300px] bg-white p-4 rounded-xl font-sans text-center group shadow-sm hover:shadow-md transition-shadow">
      <Link to={`/product/${product.id}`} className="block">
        
        {/* Image Container */}
        <div className="relative aspect-square w-full flex items-center justify-center mb-4 bg-[#f8f8f8] rounded-lg overflow-hidden">
          
          {/* "Try on" Button (Top Right) */}
          <div className="absolute top-3 right-3 z-10">
            <button className="flex items-center gap-1 bg-[#cc2121] text-white px-2.5 py-1 rounded-md text-[12px] font-bold shadow-md">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M15 8h.01M9 8h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
              </svg>
              Try on
            </button>
          </div>

          <img
            src={selectedVariant.image} 
            alt={product.name}
            className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Status Badges */}
        <div className="flex justify-center gap-2 mb-3">
          <span className="bg-[#2d5a4c] text-white text-[12px] font-bold px-3 py-0.5 rounded-[4px] uppercase tracking-wider">
            New
          </span>
          <span className="bg-[#ffea00] text-black text-[12px] font-bold px-3 py-0.5 rounded-[4px] uppercase tracking-wider">
            Premium
          </span>
        </div>

        {/* Variant Selector (Dual-tone style) */}
        <div className="flex justify-center gap-3 mb-4">
          {product.variants.map((variant, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                setSelectedVariant(variant);
              }}
              className={`w-6 h-6 rounded-full border-2 transition-all overflow-hidden flex ${
                selectedVariant.colorName === variant.colorName ? 'border-black scale-110' : 'border-gray-200'
              }`}
            >
              {/* This mimics the split-color look from the image */}
              <div className="w-1/2 h-full" style={{ backgroundColor: variant.hex }}></div>
              <div className="w-1/2 h-full brightness-75" style={{ backgroundColor: variant.hex }}></div>
            </button>
          ))}
        </div>

        {/* Text Details */}
        <div className="space-y-1">
          <h3 className="text-[#333] text-[16px] font-bold leading-tight line-clamp-1">
            {product.name}
          </h3>
          
          <p className="text-[14px]">
            <span className="text-[#a33333] font-medium">{product.shape} </span>
            <span className="text-[#a33333] font-bold">({product.gender})</span>
          </p>

          <div className="flex flex-col items-center mt-2">
            <span className="text-[#999] text-xs line-through font-medium">
              Rs {product.originalPrice}
            </span>
            <span className="text-[#001529] text-[18px] font-black leading-none">
              Rs {product.discountPrice}
            </span>
            <span className="text-[#cc2121] text-[11px] font-bold mt-1">
              Save {product.discount}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;