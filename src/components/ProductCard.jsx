import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ProductCard = ({ product, onTryOn }) => {
  const navigate = useNavigate();
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [hovered, setHovered] = useState(false);

  const handleTryOn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onTryOn) {
      onTryOn(product);
    } else {
      navigate(`/tryon?productId=${product.id}&productName=${encodeURIComponent(product.name)}&image=${encodeURIComponent(selectedVariant.image || '')}`);
    }
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
            <span style={{
              background: '#0a0a0a', color: '#fff',
              fontSize: 9, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase',
              padding: '3px 10px', borderRadius: 100,
            }}>
              New
            </span>
            <span style={{
              background: '#f5f0e8', color: '#92733a',
              fontSize: 9, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase',
              padding: '3px 10px', borderRadius: 100,
              border: '1px solid rgba(146,115,58,0.2)',
            }}>
              Premium
            </span>
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

          {/* Product Image */}
          <img
            src={selectedVariant.image}
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

          {/* Variant Swatches */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
            {product.variants.map((variant, index) => (
              <button
                key={index}
                onClick={(e) => { e.preventDefault(); setSelectedVariant(variant); }}
                aria-label={`Select ${variant.colorName}`}
                style={{
                  width: 18, height: 18, borderRadius: '50%',
                  border: selectedVariant.colorName === variant.colorName
                    ? '2px solid #0a0a0a' : '2px solid transparent',
                  outline: selectedVariant.colorName === variant.colorName
                    ? '1.5px solid rgba(0,0,0,0.18)' : 'none',
                  outlineOffset: 2,
                  background: variant.hex,
                  cursor: 'pointer', padding: 0, flexShrink: 0,
                  transform: selectedVariant.colorName === variant.colorName ? 'scale(1.18)' : 'scale(1)',
                  transition: 'transform 0.2s ease, border-color 0.2s ease, outline 0.2s ease',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.14)',
                }}
              />
            ))}
          </div>

          {/* Product Name */}
          <h3 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 17, fontWeight: 700,
            color: '#0e0e0e', letterSpacing: '-0.01em', lineHeight: 1.25,
            margin: '0 0 3px',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
          }}>
            {product.name}
          </h3>

          {/* Shape · Gender */}
          <p style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 400, margin: '0 0 11px', letterSpacing: '0.02em' }}>
            {product.shape}
            {product.gender && (
              <span style={{ color: '#C9A227', fontWeight: 500, marginLeft: 5 }}>· {product.gender}</span>
            )}
          </p>

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
                Rs {product.discountPrice}
              </span>
              <span style={{ fontSize: 11, color: '#C0C0C0', textDecoration: 'line-through', fontWeight: 400 }}>
                Rs {product.originalPrice}
              </span>
            </div>

            {product.discount && (
              <span style={{
                fontSize: 10, fontWeight: 700,
                color: '#b91c1c',
                background: 'rgba(185,28,28,0.07)',
                border: '1px solid rgba(185,28,28,0.12)',
                borderRadius: 100,
                padding: '3px 9px',
                letterSpacing: '0.04em',
                whiteSpace: 'nowrap',
              }}>
                Save {product.discount}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;