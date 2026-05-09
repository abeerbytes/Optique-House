import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ProductCard = ({ product, onTryOn }) => {
  const navigate = useNavigate();
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);
  const [hovered, setHovered] = useState(false);

  const handleTryOn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onTryOn) {
      onTryOn(product);
    } else {
      const firstImage = selectedVariant?.images?.[0] || '';
      navigate(`/tryon?productId=${product.id}&productName=${encodeURIComponent(product.name)}&image=${encodeURIComponent(firstImage)}`);
    }
  };

  // Get display price (discountPrice or originalPrice)
  const displayPrice = product.discountPrice || product.originalPrice;
  
  // Check if discount exists
  const hasDiscount = product.discount && parseFloat(product.discount) > 0;

  // Get category display name
  const getCategoryDisplay = (category) => {
    const categoryMap = {
      'men sunglass': 'Men Sunglass',
      'men eyeglass': 'Men Eyeglass',
      'woman sunglass': 'Women Sunglass',
      'women eyeglass': 'Women Eyeglass',
      'kid sunglass': 'Kids Sunglass',
      'kids eyeglass': 'Kids Eyeglass',
      'contactless': 'Contactless'
    };
    return categoryMap[category] || category;
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%',
        background: '#ffffff',
        borderRadius: 24,
        border: '1px solid rgba(0,0,0,0.07)',
        boxShadow: hovered
          ? '0 20px 52px rgba(0,0,0,0.12)'
          : '0 2px 14px rgba(0,0,0,0.06)',
        transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
        transition: 'transform 0.42s cubic-bezier(0.22,1,0.36,1), box-shadow 0.42s cubic-bezier(0.22,1,0.36,1)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      <Link
        to={`/product/${product.id}`}
        style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', flex: 1 }}
      >
        {/* ── Image Area ── */}
        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
          background: '#f6f6f4',
          overflow: 'hidden',
        }}>
          {/* Badges — top left */}
          <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 10, display: 'flex', gap: 6 }}>
            {product.madeInTaiwan && (
              <span style={{
                background: '#0a0a0a', color: '#fff',
                fontSize: 9, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase',
                padding: '3px 10px', borderRadius: 100,
              }}>
                Taiwan
              </span>
            )}
            {hasDiscount && (
              <span style={{
                background: '#f5f0e8', color: '#92733a',
                fontSize: 9, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase',
                padding: '3px 10px', borderRadius: 100,
                border: '1px solid rgba(146,115,58,0.2)',
              }}>
                {product.discount}
              </span>
            )}
            {product.reviews > 100 && (
              <span style={{
                background: '#e8f0f5', color: '#2c6e9e',
                fontSize: 9, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase',
                padding: '3px 10px', borderRadius: 100,
              }}>
                Top Rated
              </span>
            )}
          </div>

          {/* Try On — top right */}
          <button
            onClick={handleTryOn}
            style={{
              position: 'absolute', top: 12, right: 12, zIndex: 10,
              display: 'flex', alignItems: 'center', gap: 5,
              background: 'rgba(10,10,10,0.72)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.14)',
              borderRadius: 100,
              padding: '5px 12px',
              fontSize: 11, fontWeight: 600,
              fontFamily: "'Outfit', sans-serif",
              cursor: 'pointer', letterSpacing: '0.04em',
              transition: 'background 0.25s ease, transform 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.9)'; e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(10,10,10,0.72)'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9"/>
              <circle cx="12" cy="10" r="3"/>
              <path d="M6.168 18.849A4 4 0 0 1 10 16h4a4 4 0 0 1 3.834 2.855"/>
            </svg>
            Try On
          </button>

          {/* Product Image - using images array */}
          <img
            src={selectedVariant?.images?.[0] || '/placeholder-image.jpg'}
            alt={product.name}
            style={{
              width: '100%', height: '100%',
              objectFit: 'contain',
              padding: 20,
              transform: hovered ? 'scale(1.07)' : 'scale(1)',
              transition: 'transform 0.65s cubic-bezier(0.22,1,0.36,1)',
              display: 'block',
            }}
          />

          {/* Soft bottom fade */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 36,
            background: 'linear-gradient(to top, rgba(246,246,244,0.65) 0%, transparent 100%)',
            pointerEvents: 'none',
          }} />
        </div>

        {/* ── Card Body ── */}
        <div style={{ padding: '15px 17px 19px', display: 'flex', flexDirection: 'column', flex: 1 }}>

          {/* Category & Type */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 9, fontWeight: 600,
              color: '#92733a',
              background: '#f5f0e8',
              padding: '2px 8px',
              borderRadius: 100,
              letterSpacing: '0.04em',
            }}>
              {getCategoryDisplay(product.category)}
            </span>
            {product.type && (
              <span style={{
                fontSize: 9, fontWeight: 500,
                color: '#6b7280',
                background: '#f3f4f6',
                padding: '2px 8px',
                borderRadius: 100,
              }}>
                {product.type}
              </span>
            )}
            {product.pattern && (
              <span style={{
                fontSize: 9, fontWeight: 500,
                color: '#6b7280',
                background: '#f3f4f6',
                padding: '2px 8px',
                borderRadius: 100,
              }}>
                {product.pattern}
              </span>
            )}
          </div>

          {/* Variant Swatches */}
          {product.variants && product.variants.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
              {product.variants.map((variant, index) => (
                <button
                  key={index}
                  onClick={(e) => { e.preventDefault(); setSelectedVariant(variant); }}
                  aria-label={`Select ${variant.colorName}`}
                  style={{
                    width: 22, height: 22, borderRadius: '50%',
                    border: selectedVariant?.colorName === variant.colorName
                      ? '2px solid #0a0a0a' : '2px solid transparent',
                    outline: selectedVariant?.colorName === variant.colorName
                      ? '1.5px solid rgba(0,0,0,0.18)' : 'none',
                    outlineOffset: 2,
                    background: variant.hex || '#cccccc',
                    cursor: 'pointer', padding: 0, flexShrink: 0,
                    transform: selectedVariant?.colorName === variant.colorName ? 'scale(1.18)' : 'scale(1)',
                    transition: 'transform 0.2s ease, border-color 0.2s ease, outline 0.2s ease',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.14)',
                  }}
                />
              ))}
              <span style={{ fontSize: 9, color: '#9ca3af', marginLeft: 4 }}>
                {product.variants.length} colors
              </span>
            </div>
          )}

          {/* Product Name */}
          <h3 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 17, fontWeight: 700,
            color: '#0e0e0e', letterSpacing: '-0.01em', lineHeight: 1.25,
            margin: '0 0 3px',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}>
            {product.name}
          </h3>

          {/* Shape · Gender · Frame Color */}
          <p style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 400, margin: '0 0 11px', letterSpacing: '0.02em' }}>
            {product.shape && product.shape !== 'Other' ? product.shape : 'Contemporary'}
            {product.gender && (
              <span style={{ color: '#C9A227', fontWeight: 500, marginLeft: 5 }}>· {product.gender}</span>
            )}
            {product.color && (
              <span style={{ marginLeft: 5 }}>· {product.color}</span>
            )}
          </p>

          {/* Detail Description - preview */}
          {product.detailDescription && (
            <p style={{
              fontSize: 10, color: '#6b7280', lineHeight: 1.35,
              margin: '0 0 10px',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}>
              {product.detailDescription}
            </p>
          )}

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(0,0,0,0.06)', marginBottom: 11 }} />

          {/* Pricing row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 20, fontWeight: 700,
                color: '#0e0e0e', lineHeight: 1, letterSpacing: '-0.02em',
              }}>
                Rs {displayPrice}
              </span>
              {product.discountPrice && product.originalPrice && (
                <span style={{ fontSize: 11, color: '#C0C0C0', textDecoration: 'line-through', fontWeight: 400 }}>
                  Rs {product.originalPrice}
                </span>
              )}
            </div>

            {/* Reviews Count */}
            {product.reviews > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="1">
                  <polygon points="12 17.27 18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21 12 17.27" />
                </svg>
                <span style={{ fontSize: 10, fontWeight: 500, color: '#6b7280' }}>
                  {product.reviews} reviews
                </span>
              </div>
            )}
          </div>

          {/* Code */}
          {product.code && (
            <p style={{
              fontSize: 9, color: '#cbd5e1', marginTop: 10,
              letterSpacing: '0.03em', textAlign: 'right',
            }}>
              SKU: {product.code}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;