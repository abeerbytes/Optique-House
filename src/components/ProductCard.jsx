import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// ─────────────────────────────────────────────────────────────────────────────
// SMART IMAGE NORMALIZER
// Analyses image pixels via offscreen canvas → finds actual eyewear bounds →
// returns {scale, translateX%, translateY%} so every frame fills the card
// consistently regardless of original whitespace / padding / position.
// ─────────────────────────────────────────────────────────────────────────────
const useImageNormalization = (src, targetFill = 0.82) => {
  const [style, setStyle] = useState({
    transform: 'scale(1.12)',
    transformOrigin: 'center center',
    transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1)',
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!src) return;
    let cancelled = false;

    const analyse = async () => {
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = src;
        });

        if (cancelled) return;

        const W = img.naturalWidth;
        const H = img.naturalHeight;
        if (!W || !H) return;

        // Draw to offscreen canvas at reduced resolution for speed
        const SAMPLE = 320;
        const sw = SAMPLE;
        const sh = Math.round((H / W) * SAMPLE);

        const canvas = document.createElement('canvas');
        canvas.width = sw;
        canvas.height = sh;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, sw, sh);

        const { data } = ctx.getImageData(0, 0, sw, sh);

        // Classify a pixel as "content" if it's not near-white and not transparent
        const isContent = (i) => {
          const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
          if (a < 30) return false;
          // near-white check (handles #f8f8f6 background too)
          if (r > 235 && g > 235 && b > 235) return false;
          return true;
        };

        let minX = sw, maxX = 0, minY = sh, maxY = 0;
        let found = false;

        for (let y = 0; y < sh; y++) {
          for (let x = 0; x < sw; x++) {
            const i = (y * sw + x) * 4;
            if (isContent(i)) {
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
              found = true;
            }
          }
        }

        if (!found || cancelled) return;

        // Add small padding to avoid clipping thin temple tips
        const pad = 4;
        minX = Math.max(0, minX - pad);
        minY = Math.max(0, minY - pad);
        maxX = Math.min(sw - 1, maxX + pad);
        maxY = Math.min(sh - 1, maxY + pad);

        const contentW = maxX - minX;
        const contentH = maxY - minY;
        const contentCX = (minX + maxX) / 2 / sw;  // 0..1
        const contentCY = (minY + maxY) / 2 / sh;  // 0..1

        // Scale: how much to zoom so content fills targetFill of container
        const scaleX = (targetFill * sw) / contentW;
        const scaleY = (targetFill * sh) / contentH;
        const scale = Math.min(scaleX, scaleY, 2.2); // cap at 2.2× to avoid over-zoom

        // Translate: shift content center to container center (50%, 50%)
        // CSS transform-origin is center, so we work in % of element size
        const txPct = (0.5 - contentCX) * 100;
        const tyPct = (0.5 - contentCY) * 100;

        if (!cancelled) {
          setStyle({
            transform: `translate(${txPct.toFixed(2)}%, ${tyPct.toFixed(2)}%) scale(${scale.toFixed(3)})`,
            transformOrigin: 'center center',
            transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1)',
            willChange: 'transform',
          });
          setReady(true);
        }
      } catch {
        // Fallback: just apply a safe default zoom
        if (!cancelled) {
          setStyle({
            transform: 'scale(1.1)',
            transformOrigin: 'center center',
            transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1)',
          });
          setReady(true);
        }
      }
    };

    analyse();
    return () => { cancelled = true; };
  }, [src, targetFill]);

  return { normalizedStyle: style, ready };
};


// ─────────────────────────────────────────────────────────────────────────────
// NORMALISED IMAGE WRAPPER
// ─────────────────────────────────────────────────────────────────────────────
const NormalizedImage = ({ src, alt, hovered }) => {
  const { normalizedStyle, ready } = useImageNormalization(src, 0.84);

  const hoverBoost = hovered ? 1.055 : 1;

  // Merge normalization transform with hover scale
  // We wrap in a second div so hover scale doesn't fight the offset translate
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
      background: '#ffffff',
    }}>
      {/* Outer: applies the normalization translate + scale */}
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: ready ? 1 : 0,
        transition: 'opacity 0.35s ease',
      }}>
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
            imageRendering: 'high-quality',
            ...normalizedStyle,
            // Layer hover boost on top of normalization
            transform: normalizedStyle.transform
              ? normalizedStyle.transform.replace(
                  /scale\(([^)]+)\)/,
                  (_, s) => `scale(${(parseFloat(s) * hoverBoost).toFixed(3)})`
                )
              : `scale(${hoverBoost})`,
          }}
        />
      </div>

      {/* Skeleton shimmer while analysing */}
      {!ready && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, #f5f5f5 25%, #ebebeb 50%, #f5f5f5 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.6s infinite',
        }} />
      )}
    </div>
  );
};


// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT CARD
// ─────────────────────────────────────────────────────────────────────────────
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
      navigate(
        `/tryon?productId=${product.id}&productName=${encodeURIComponent(product.name)}&image=${encodeURIComponent(firstImage)}`
      );
    }
  };

  const displayPrice = product.discountPrice || product.originalPrice;
  const hasDiscount = product.discount && parseFloat(product.discount) > 0;
  const imageSrc = selectedVariant?.images?.[0] || '/placeholder-image.jpg';

  const getCategoryDisplay = (cat) => ({
    'men sunglass': 'Men Sunglass',
    'men eyeglass': 'Men Eyeglass',
    'woman sunglass': 'Women Sunglass',
    'women eyeglass': 'Women Eyeglass',
    'kid sunglass': 'Kids Sunglass',
    'kids eyeglass': 'Kids Eyeglass',
    'contactless': 'Contactless',
  }[cat] || cat);

  return (
    <>
      {/* Shimmer keyframe — injected once */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
      `}</style>

      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '100%',
          background: '#ffffff',
          borderRadius: 24,
          border: '1px solid rgba(0,0,0,0.07)',
          boxShadow: hovered
            ? '0 22px 56px rgba(0,0,0,0.13)'
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
          {/* ── IMAGE AREA ── */}
          <div style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '4 / 3',
            background: '#ffffff',
            overflow: 'hidden',
          }}>


            {/* ── BADGES — top left ── */}
            <div style={{
              position: 'absolute', top: 12, left: 12, zIndex: 10,
              display: 'flex', gap: 6, flexWrap: 'wrap',
            }}>
              {product.madeInTaiwan && (
                <span style={{
                  background: '#0a0a0a', color: '#fff',
                  fontSize: 9, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase',
                  padding: '3px 10px', borderRadius: 100,
                }}>Taiwan</span>
              )}
              {hasDiscount && (
                <span style={{
                  background: '#f5f0e8', color: '#92733a',
                  fontSize: 9, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase',
                  padding: '3px 10px', borderRadius: 100,
                  border: '1px solid rgba(146,115,58,0.2)',
                }}>{product.discount}</span>
              )}
              {product.reviews > 100 && (
                <span style={{
                  background: '#e8f0f5', color: '#2c6e9e',
                  fontSize: 9, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase',
                  padding: '3px 10px', borderRadius: 100,
                }}>Top Rated</span>
              )}
            </div>

            {/* ── TRY ON — top right ── */}
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
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.92)'; e.currentTarget.style.transform = 'scale(1.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(10,10,10,0.72)'; e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9"/>
                <circle cx="12" cy="10" r="3"/>
                <path d="M6.168 18.849A4 4 0 0 1 10 16h4a4 4 0 0 1 3.834 2.855"/>
              </svg>
              Try On
            </button>

            {/* ── NORMALISED PRODUCT IMAGE ── */}
            <NormalizedImage
              src={imageSrc}
              alt={product.name}
              hovered={hovered}
            />

            {/* Soft bottom fade */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 32, zIndex: 2,
              background: 'linear-gradient(to top, rgba(255,255,255,0.85) 0%, transparent 100%)',
              pointerEvents: 'none',
            }} />
          </div>

          {/* ── CARD BODY ── */}
          <div style={{ padding: '15px 17px 19px', display: 'flex', flexDirection: 'column', flex: 1 }}>

            {/* Category & Type */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
              <span style={{
                fontSize: 9, fontWeight: 600, color: '#92733a',
                background: '#f5f0e8', padding: '2px 8px', borderRadius: 100, letterSpacing: '0.04em',
              }}>
                {getCategoryDisplay(product.category)}
              </span>
              {product.type && (
                <span style={{
                  fontSize: 9, fontWeight: 500, color: '#6b7280',
                  background: '#f3f4f6', padding: '2px 8px', borderRadius: 100,
                }}>{product.type}</span>
              )}
              {product.pattern && (
                <span style={{
                  fontSize: 9, fontWeight: 500, color: '#6b7280',
                  background: '#f3f4f6', padding: '2px 8px', borderRadius: 100,
                }}>{product.pattern}</span>
              )}
            </div>

            {/* Variant Swatches */}
            {product.variants?.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
                {product.variants.map((variant, i) => (
                  <button
                    key={i}
                    onClick={e => { e.preventDefault(); setSelectedVariant(variant); }}
                    aria-label={`Select ${variant.colorName}`}
                    style={{
                      width: 22, height: 22, borderRadius: '50%',
                      border: selectedVariant?.colorName === variant.colorName
                        ? '2px solid #0a0a0a' : '2px solid transparent',
                      outline: selectedVariant?.colorName === variant.colorName
                        ? '1.5px solid rgba(0,0,0,0.18)' : 'none',
                      outlineOffset: 2,
                      background: variant.hex || '#ccc',
                      cursor: 'pointer', padding: 0, flexShrink: 0,
                      transform: selectedVariant?.colorName === variant.colorName ? 'scale(1.18)' : 'scale(1)',
                      transition: 'transform 0.2s ease, border-color 0.2s ease',
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
              {product.color && <span style={{ marginLeft: 5 }}>· {product.color}</span>}
            </p>

            {/* Detail Description */}
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

            {/* SKU */}
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
    </>
  );
};

export default ProductCard;