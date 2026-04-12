import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [hoveredColor, setHoveredColor] = useState(null);

  return (
    <div className="group relative bg-white transition-all duration-300">
      <Link to={`/product/${product.id}`} className="block">
        {/* Image Container with Light Gray Background */}
        <div className="relative aspect-[4/3] w-full bg-[#f4f4f4] flex items-center justify-center overflow-hidden mb-3">
          {/* Top Right Badges */}
          <div className="absolute top-0 right-0 z-10 flex flex-col items-end">
            <span className="bg-[#ff0000] text-white text-[11px] font-bold px-2 py-1">
              -{product.discount}
            </span>
            {product.madeInTaiwan && (
              <span className="bg-[#00adef] text-white text-[10px] px-2 py-1 font-semibold mt-0.5">
                Made in Taiwan
              </span>
            )}
            {/* Added "Made in France" logic if needed based on the image */}
            {product.id === 4 && ( // Example condition
               <span className="bg-[#00adef] text-white text-[10px] px-2 py-1 font-semibold mt-0.5">
               Made In France
             </span>
            )}
          </div>

          <img
            src={selectedVariant.image}
            alt={product.name}
            className="w-full h-full object-contain p-4 mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Product Details */}
        <div className="px-1 space-y-0.5">
          <h3 className="text-[#333] text-[13px] font-medium truncate">
            {product.name}
          </h3>
          
          {/* Rating Stars & Review Count */}
          <div className="flex items-center gap-1">
            <div className="flex text-black text-[10px]">
              {[...Array(5)].map((_, i) => (
                <span key={i}>{i < 5 ? "★" : "☆"}</span>
              ))}
            </div>
            <span className="text-gray-500 text-[11px]">{product.reviews} reviews</span>
          </div>

          {/* Pricing - Using the specific colors from image */}
          <div className="flex items-center gap-2 text-[12px]">
            <span className="text-[#999] line-through">
              Rs.{product.originalPrice} PKR
            </span>
            <span className="text-[#e32a2a] font-semibold">
              Rs.{product.discountPrice} PKR
            </span>
          </div>
        </div>
      </Link>

      {/* Color Swatches - Positioned below text like the image */}
      <div className="flex items-center gap-2 mt-3 px-1">
        {product.variants.map((variant, index) => (
          <button
            key={index}
            onClick={() => setSelectedVariant(variant)}
            onMouseEnter={() => setHoveredColor(variant.colorName)}
            onMouseLeave={() => setHoveredColor(null)}
            className={`w-3.5 h-3.5 rounded-full border border-gray-200 transition-all relative ${
              selectedVariant.colorName === variant.colorName 
              ? 'ring-1 ring-offset-1 ring-black' 
              : ''
            }`}
            style={{ backgroundColor: variant.hex }}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductCard;