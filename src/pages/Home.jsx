// components/Home.js
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import data from '../data/data.json';
import { Gem, Box, Headset, RotateCcw } from 'lucide-react';
import FullWidthVideo from '../components/FullWidthVideo';

/* ─────────────────────────────────────────────
   GLOBAL STYLES - Light Theme with Gradient & Glass
   FULLY RESPONSIVE for Mobile + iPad (design unchanged on desktop)
───────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');

  :root {
    --glass-white: rgba(255, 255, 255, 0.75);
    --glass-border: rgba(255, 255, 255, 0.5);
    --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    --ink: #1a1a2e;
    --ink-light: #2d2d44;
    --gold: #c9a84c;
    --gold-light: #e0c268;
    --accent: #4a6fa5;
    --text-muted: #5a5a72;
    --ff-display: 'Playfair Display', Georgia, serif;
    --ff-body: 'Inter', system-ui, -apple-system, sans-serif;
    --ease: cubic-bezier(0.2, 0.9, 0.4, 1.1);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: var(--ff-body);
    background: linear-gradient(135deg, #f8f9ff 0%, #eef2fa 50%, #e8edf5 100%);
    color: var(--ink);
    min-height: 100vh;
    overflow-x: hidden;
    width: 100%;
  }

  /* Glass base styles */
  .glass-card {
    background: var(--glass-white);
    backdrop-filter: blur(12px);
    border: 1px solid var(--glass-border);
    border-radius: 28px;
    box-shadow: var(--glass-shadow);
    transition: all 0.3s var(--ease);
  }

  .glass-card:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.85);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
  }

  /* Simple reveal animation */
  .reveal {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.6s var(--ease), transform 0.6s var(--ease);
  }

  .reveal.in {
    opacity: 1;
    transform: translateY(0);
  }

  /* Horizontal scroll */
  .h-scroll-track {
    display: flex;
    gap: 1.5rem;
    overflow-x: auto;
    padding-bottom: 1rem;
    scroll-snap-type: x mandatory;
  }

  .h-scroll-track::-webkit-scrollbar {
    height: 4px;
  }

  .h-scroll-track::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 10px;
  }

  .h-scroll-track::-webkit-scrollbar-thumb {
    background: var(--gold);
    border-radius: 10px;
  }

  /* Buttons */
  .btn-primary {
    background: var(--ink);
    color: white;
    padding: 0.85rem 2rem;
    border-radius: 48px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.2s var(--ease);
    font-family: var(--ff-body);
  }

  .btn-primary:hover {
    background: var(--ink-light);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }

  .btn-gold {
    background: var(--gold);
    color: var(--ink);
    padding: 0.85rem 2rem;
    border-radius: 48px;
    font-weight: 700;
    border: none;
    cursor: pointer;
    transition: all 0.2s var(--ease);
    font-family: var(--ff-body);
  }

  .btn-gold:hover {
    background: var(--gold-light);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(201, 168, 76, 0.3);
  }

  .btn-outline {
    background: transparent;
    border: 1.5px solid var(--ink);
    color: var(--ink);
    padding: 0.8rem 2rem;
    border-radius: 48px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s var(--ease);
  }

  .btn-outline:hover {
    background: var(--ink);
    color: white;
    transform: translateY(-2px);
  }

  /* Tag pill */
  .tag {
    display: inline-block;
    padding: 0.25rem 0.9rem;
    border-radius: 40px;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    background: rgba(201, 168, 76, 0.15);
    color: var(--gold);
    border: 1px solid rgba(201, 168, 76, 0.3);
  }

  /* WhatsApp floating */
  @keyframes waPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.5); }
    50% { box-shadow: 0 0 0 12px rgba(37, 211, 102, 0); }
  }
  .wa-btn {
    animation: waPulse 2s infinite;
  }

  /* ============================================
     RESPONSIVE STYLES (Mobile + iPad)
     Desktop design completely unchanged
  ============================================ */
  
  /* iPad and medium tablets (portrait and landscape) */
  @media screen and (max-width: 1024px) and (min-width: 769px) {
    .container {
      padding-left: 2rem;
      padding-right: 2rem;
    }
    
    .categories-grid {
      gap: 1.25rem !important;
    }
    
    .category-card .image-wrapper {
      width: 110px !important;
      height: 110px !important;
    }
    
    .product-glass {
      padding: 0.9rem;
    }
    
    /* Hero iPad fixes */
    .hero-overlay {
      padding-left: 8% !important;
      padding-right: 8% !important;
    }
    
    .hero-title {
      font-size: clamp(2rem, 4vw, 3rem) !important;
    }
  }
  
  /* Mobile devices (phones, 768px and below) */
  @media screen and (max-width: 768px) {
    :root {
      --glass-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    }
    
    body {
      font-size: 14px;
    }
    
    /* Adjust glass card for mobile */
    .glass-card {
      border-radius: 20px;
      backdrop-filter: blur(8px);
    }
    
    .glass-card:hover {
      transform: translateY(-2px);
    }
    
    /* Hero mobile fixes */
    .hero-overlay {
      padding-left: 5% !important;
      padding-right: 5% !important;
    }
    
    .hero-title {
      font-size: clamp(1.5rem, 6vw, 2.2rem) !important;
    }
    
    .hero-divider {
      width: 40px !important;
      margin: 0.75rem 0 !important;
    }
    
    .hero-dots {
      bottom: 15px !important;
      gap: 8px !important;
    }
    
    .hero-dot {
      width: 8px !important;
      height: 8px !important;
    }
    
    /* category section mobile */
    .categories-section {
      padding: 2rem 1rem !important;
    }
    
    .categories-grid {
      gap: 1rem !important;
    }
    
    .category-card .image-wrapper {
      width: 85px !important;
      height: 85px !important;
    }
    
    .category-name {
      font-size: 0.7rem !important;
    }
    
    /* features grid mobile */
    .features-grid {
      gap: 1.5rem !important;
      grid-template-columns: repeat(2, 1fr) !important;
    }
    
    /* product section */
    .product-section-title {
      font-size: 1.5rem !important;
    }
    
    /* hide carousel arrows on mobile */
    .carousel-arrow {
      display: none !important;
    }
    
    .product-scroll-track {
      gap: 1rem !important;
      padding-bottom: 0.75rem;
    }
    
    .product-card-wrapper {
      min-width: 240px !important;
    }
    
    /* CTA section mobile */
    .cta-glass-card {
      padding: 1.5rem !important;
      margin: 0 0.5rem;
    }
    
    .cta-title {
      font-size: 1.4rem !important;
    }
    
    /* testimonials mobile */
    .testimonials-grid {
      grid-template-columns: 1fr !important;
      gap: 1.25rem !important;
    }
    
    /* newsletter mobile */
    .newsletter-glass {
      padding: 1.75rem 1.25rem !important;
    }
    
    .newsletter-input-group {
      flex-direction: column !important;
      gap: 0.75rem !important;
    }
    
    .newsletter-input {
      width: 100% !important;
      min-width: auto !important;
    }
    
    /* section paddings */
    section {
      padding-left: 1rem !important;
      padding-right: 1rem !important;
    }
    
    .feature-icon svg {
      width: 32px !important;
      height: 32px !important;
    }
    
    .feature-title {
      font-size: 0.85rem !important;
    }
    
    .feature-desc {
      font-size: 0.75rem !important;
    }
    
    /* view all button */
    .view-all-btn {
      font-size: 0.75rem !important;
    }
    
    /* product section header */
    .section-header {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 0.5rem !important;
    }
    
    /* category grid responsive */
    .categories-grid {
      grid-template-columns: repeat(3, 1fr) !important;
    }
    
    /* Floating WA button */
    .wa-btn {
      width: 48px !important;
      height: 48px !important;
      bottom: 1rem !important;
      right: 1rem !important;
    }
    
    .wa-btn img {
      width: 24px !important;
      height: 24px !important;
    }
  }
  
  /* Small mobile (below 480px) */
  @media screen and (max-width: 480px) {
    .hero-title {
      font-size: clamp(1.2rem, 5vw, 1.8rem) !important;
    }
    
    .hero-divider {
      width: 30px !important;
      margin: 0.5rem 0 !important;
    }
    
    .hero-overlay {
      padding-left: 4% !important;
      padding-right: 4% !important;
    }
    
    .categories-grid {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 0.75rem !important;
    }
    
    .category-card .image-wrapper {
      width: 90px !important;
      height: 90px !important;
    }
    
    .features-grid {
      grid-template-columns: 1fr !important;
      gap: 1.5rem !important;
    }
    
    .product-card-wrapper {
      min-width: 200px !important;
    }
    
    .cta-glass-card {
      padding: 1.25rem !important;
    }
    
    .btn-primary, .btn-gold {
      padding: 0.6rem 1.25rem !important;
      font-size: 0.8rem;
    }
  }
`;

function useGlobalStyles() {
  useEffect(() => {
    const id = 'light-glass-styles';
    if (!document.getElementById(id)) {
      const style = document.createElement('style');
      style.id = id;
      style.textContent = GLOBAL_CSS;
      document.head.appendChild(style);
    }
  }, []);
}

function useScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('in');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
    );
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ─────────────────────────────────────────────
   FIXED HERO SECTION - Small height, proper banner width on mobile
───────────────────────────────────────────── */
const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { image: './ban1.jpeg', title: '', subtitle: '', tagline: '' },
    { image: './ban2.jpeg', title: '', subtitle: '', tagline: '' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section style={{
  minHeight: '100vh',
  maxHeight: '100vh',
  width: '100%',
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: '#f5f5f5',
  ...(window.innerWidth <= 768 && {
    minHeight: '30vh',
  })
}}>
      {slides.map((slide, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: 'auto',
            backgroundImage: `url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: currentSlide === index ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
            zIndex: 1
          }}
        />
      ))}

      <div style={{
        position: 'relative',
        zIndex: 2,
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingLeft: '10%',
        paddingRight: '5%',
        color: '#fff',
        textShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }} className="hero-overlay">
        <h1 className="hero-title" style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 400,
          letterSpacing: '0.05em',
          margin: 0,
          lineHeight: 1.2,
          textTransform: 'uppercase'
        }}>
          {slides[currentSlide].title}<br />
          <span style={{ fontWeight: 700 }}>{slides[currentSlide].subtitle}</span>
        </h1>
        
        <div className="hero-divider" style={{
          width: '50px',
          height: '2px',
          backgroundColor: '#fff',
          margin: '1.5rem 0'
        }} />

        <p style={{
          fontSize: '0.9rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          fontWeight: 500
        }}>
          {slides[currentSlide].tagline}
        </p>
      </div>

      <div className="hero-dots" style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '10px',
        zIndex: 3
      }}>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className="hero-dot"
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: currentSlide === i ? '#fff' : 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          />
        ))}
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   CATEGORY CIRCLES (responsive grid)
───────────────────────────────────────────── */
const TopCategories = () => {
  const cats = [
    { name: "Men's Eyeglasses", img: './cat1.jpeg' },
    { name: "Men's Sunglasses", img: './cat2.jpeg' },
    { name: "Women's Eyeglasses", img: './cat3.jpeg' },
    { name: "Women's Sunglasses", img: './cat4.jpeg' },
    { name: 'Color Contact Lenses', img: './cat5.jpeg' },
    { name: 'Clear Contact Lenses', img: './cat6.jpeg' },
  ];

  return (
    <section className="categories-section" style={{ padding: '3rem 1rem', background: 'transparent' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 className="section-title" style={{ fontFamily: 'var(--ff-display)', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', textAlign: 'center', marginBottom: '1.75rem' }}>Top Categories</h2>
        
        <div className="categories-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
          gap: '1.5rem',
          justifyItems: 'center',
          alignItems: 'center'
        }}>
          {cats.map((cat, i) => (
            <div key={i} className="category-card" style={{ textAlign: 'center', cursor: 'pointer' }}>
              <div className="image-wrapper" style={{
                width: '110px',
                height: '110px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid var(--gold)',
                padding: '3px',
                margin: '0 auto',
                transition: 'transform 0.2s var(--ease)'
              }}>
                <img src={cat.img} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              </div>
              <p className="category-name" style={{ marginTop: '0.65rem', fontSize: '0.8rem', fontWeight: 500 }}>{cat.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   FEATURE CARDS (responsive grid)
───────────────────────────────────────────── */
const Features = () => {
  const features = [
    { icon: <Gem size={38} strokeWidth={1} />, title: 'PREMIUM QUALITY', desc: 'Premium Quality Frames & Lenses' },
    { icon: <Box size={38} strokeWidth={1} />, title: 'DELIVERING WORLDWIDE', desc: 'Order now and get your deliveries worldwide' },
    { icon: <Headset size={38} strokeWidth={1} />, title: 'SUPPORT 24/7', desc: "Contact us! We're available 24/7" },
    { icon: <RotateCcw size={38} strokeWidth={1} />, title: 'RETURN & EXCHANGE', desc: 'Easy 7 Days Exchange Policy' },
  ];

  return (
    <section style={{ padding: '3rem 1rem', backgroundColor: '#fff' }}>
      <div className="features-grid" style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '2rem' 
      }}>
        {features.map((f, i) => (
          <div key={i} style={{ textAlign: 'center', color: '#1a1a1a' }}>
            <div className="feature-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem', color: '#333' }}>
              {f.icon}
            </div>
            <h4 className="feature-title" style={{ fontSize: '1rem', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 0.5rem 0' }}>
              {f.title}
            </h4>
            <p className="feature-desc" style={{ fontSize: '0.85rem', color: '#777', fontWeight: '300', lineHeight: '1.4', margin: 0 }}>
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   PRODUCT SECTION with Horizontal Scroll (responsive)
───────────────────────────────────────────── */
const ProductSection = ({ title, subtitle, products, tag }) => {
  const navigate = useNavigate();
  const trackRef = useRef(null);

  const scroll = (direction) => {
    if (trackRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      trackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Handle try on for any product
  const handleTryOn = (product) => {
    console.log('Product from Home:', product);
    // Navigate directly with product ID
    navigate(`/tryon?productId=${product.id}&productName=${encodeURIComponent(product.name)}`);
  };

  if (!products?.length) return null;

  const videoConfig = {
    "Contact Lenses": { src: "https://cdn.shopify.com/videos/c/o/v/833459dc295b4d71aef7a9636dffa2e8.mp4", title: "" },
    "Men's Collection": { src: "https://cdn.shopify.com/videos/c/o/v/ed1b7a80d9de4a0a90c8ce5dff2bd48b.mp4", title: "" },
    "Women's Collection": { src: "/videos/women-collection.mp4", title: "Elevate your style" },
    "Kids' Collection": { src: "/videos/kids-collection.mp4", title: "Fun & flexible frames" }
  };

  const shouldShowVideo = videoConfig[title];

  return (
    <>
      <section className="min-h-screen w-full py-12 bg-white flex items-center justify-center">
        <div className="w-full max-w-[1320px] mx-auto px-4 md:px-6 relative">
          
          <div className="section-header flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              {tag && <span className="inline-block text-sm font-semibold text-gray-500 mb-2">{tag}</span>}
              <h2 className="product-section-title text-2xl md:text-3xl font-bold tracking-tight text-gray-900">{title}</h2>
              {subtitle && <p className="text-gray-600 mt-1 text-sm md:text-base">{subtitle}</p>}
            </div>
            <button className="view-all-btn text-sm font-semibold text-gray-600 hover:text-black transition-colors underline underline-offset-4">
              View All
            </button>
          </div>

          <div className="relative">
            <div className="hidden md:block carousel-arrow">
              <button 
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 bg-white border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-50 transition-all active:scale-95"
                aria-label="Scroll Left"
              >
                <span className="text-2xl">‹</span>
              </button>

              <button 
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-30 bg-white border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-50 transition-all active:scale-95"
                aria-label="Scroll Right"
              >
                <span className="text-2xl">›</span>
              </button>
            </div>

            <div 
              ref={trackRef}
              className="product-scroll-track flex overflow-x-auto gap-6 no-scrollbar pb-6 snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', justifyContent: 'flex-start' }}
            >
              {products.map((product) => (
                <div key={product.id} className="product-card-wrapper min-w-[270px] md:min-w-[290px] flex-shrink-0 snap-start">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
        `}</style>
      </section>

      {shouldShowVideo && <FullWidthVideo src={shouldShowVideo.src} title={shouldShowVideo.title} />}
    </>
  );
};

/* ─────────────────────────────────────────────
   SIMPLE CALL TO ACTION - Glass Style (responsive)
───────────────────────────────────────────── */
const CTASection = () => {
  const navigate = useNavigate();
  
  return (
    <section style={{
      padding: '4rem 2rem',
      backgroundImage: 'url("https://cdn.prod.website-files.com/66751ebd9740f5d5704a4b56/66ff7b69eec253d6cbc42034_66%20-%2015%20Best%20Try-On%20Glasses%20in%202024.webp")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      position: 'relative'
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1, padding: '0 1rem' }}>
        <div className="glass-card reveal cta-glass-card" style={{ 
          padding: '2.5rem', 
          textAlign: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          borderRadius: '1rem',
          backdropFilter: 'blur(2px)'
        }}>
          <h2 className="cta-title" style={{ fontFamily: 'var(--ff-display)', fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)', marginBottom: '0.75rem' }}>
            Virtual Try-On
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto 1.25rem', fontSize: '0.9rem' }}>
            See how frames look on your face — from any angle — using our AI-powered tool.
          </p>
          <button 
            className="btn-gold" 
            onClick={() => navigate('/tryon')}
          >
            Try Now
          </button>
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   TESTIMONIALS (Glass Cards) responsive grid
───────────────────────────────────────────── */
const Testimonials = () => {
  const reviews = [
    { name: 'Ayesha Khan', text: 'The virtual try-on was so accurate! My frames arrived in perfect condition.', rating: 5 },
    { name: 'Hassan Malik', text: 'Best collection in Pakistan. The blue light glasses have reduced my screen fatigue.', rating: 5 },
    { name: 'Sana Ahmed', text: 'Excellent quality at fair prices. Customer service was extremely helpful.', rating: 5 },
  ];
  return (
    <section style={{ padding: '4rem 2rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="tag">Testimonials</span>
          <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)', marginTop: '0.75rem' }}>
            What Customers <span style={{ color: 'var(--gold)' }}>Say</span>
          </h2>
        </div>
        <div className="testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {reviews.map((r, i) => (
            <div key={i} className="glass-card reveal" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: '0.75rem' }}>
                {[...Array(r.rating)].map((_, j) => <span key={j} style={{ color: 'var(--gold)' }}>★</span>)}
              </div>
              <p style={{ fontStyle: 'italic', marginBottom: '1.25rem', color: 'var(--ink)', fontSize: '0.9rem' }}>"{r.text}"</p>
              <p style={{ fontWeight: 700 }}>{r.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   NEWSLETTER - Glass (responsive)
───────────────────────────────────────────── */
const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  return (
    <section style={{
      padding: '4rem 2rem',
      backgroundImage: 'url("https://static.vecteezy.com/system/resources/thumbnails/025/373/863/small/five-pairs-of-glasses-lined-up-against-a-white-background-created-with-generative-ai-technology-free-photo.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'top center',
      backgroundRepeat: 'no-repeat',
      position: 'relative'
    }}>
      <div style={{ maxWidth: 550, margin: '0 auto', position: 'relative', zIndex: 1, padding: '0 1rem' }}>
        <div className="glass-card reveal newsletter-glass" style={{ 
          padding: '2.5rem', 
          textAlign: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          borderRadius: '1rem'
        }}>
          <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.6rem', marginBottom: '0.5rem' }}>Get Exclusive Offers</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>Join 50,000+ members for early access to sales.</p>
          {subscribed ? (
            <p style={{ fontWeight: 600, color: 'var(--gold)' }}>🎉 You're in! Check your inbox.</p>
          ) : (
            <div className="newsletter-input-group" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email"
                className="newsletter-input"
                style={{ flex: 1, minWidth: 200, padding: '0.7rem 1.2rem', borderRadius: '48px', border: '1px solid rgba(0,0,0,0.1)', background: 'white', fontFamily: 'var(--ff-body)', fontSize: '0.9rem' }}
              />
              <button className="btn-primary" onClick={() => email && setSubscribed(true)} style={{ padding: '0.7rem 1.5rem', fontSize: '0.9rem' }}>Subscribe →</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   FLOATING WHATSAPP (responsive)
───────────────────────────────────────────── */
const FloatingWA = () => (
  <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer"
    className="wa-btn"
    style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 999,
      width: 52,
      height: 52,
      borderRadius: '50%',
      background: '#25d366',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
      transition: 'transform 0.2s'
    }}
    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
    onMouseLeave={e => e.currentTarget.style.transform = ''}>
    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style={{ width: 26, height: 26 }} />
  </a>
);

/* ─────────────────────────────────────────────
   SAMPLE DATA FALLBACK
───────────────────────────────────────────── */
const SAMPLE = {
  contactLenses: [
    { id: 101, name: 'Premium Daily Contact Lenses', discount: '20%', madeInTaiwan: true, originalPrice: 4999, discountPrice: 3999, reviews: 128, variants: [{ colorName: 'Clear', hex: '#E8F4F8', image: 'https://images.unsplash.com/photo-1581579186913-45ac3e6a2c2e?w=400' }] },
    { id: 102, name: 'Monthly Bio Lenses', discount: '15%', madeInTaiwan: true, originalPrice: 5999, discountPrice: 5099, reviews: 94, variants: [{ colorName: 'Clear', hex: '#E8F4F8', image: 'https://images.unsplash.com/photo-1581579186913-45ac3e6a2c2e?w=400' }] },
  ],
  men: [
    { id: 201, name: 'Aviator Classic Gold', discount: '20%', madeInTaiwan: true, originalPrice: 12999, discountPrice: 10399, reviews: 89, variants: [{ colorName: 'Gold', hex: '#FFD700', image: 'https://images.unsplash.com/photo-1502767089025-6572583495f9?w=400' }] },
    { id: 202, name: 'Wayfarer Classic Black', discount: '15%', madeInTaiwan: false, originalPrice: 9999, discountPrice: 8499, reviews: 156, variants: [{ colorName: 'Black', hex: '#000000', image: 'https://images.unsplash.com/photo-1502767089025-6572583495f9?w=400' }] },
  ],
  women: [
    { id: 301, name: 'Cat Eye Elegance', discount: '20%', madeInTaiwan: true, originalPrice: 13999, discountPrice: 11199, reviews: 178, variants: [{ colorName: 'Rose Gold', hex: '#B76E79', image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400' }] },
  ],
  kids: [
    { id: 401, name: 'Blue Light Shield Kids', discount: '20%', madeInTaiwan: true, originalPrice: 6999, discountPrice: 5599, reviews: 89, variants: [{ colorName: 'Blue', hex: '#4A90E2', image: 'https://images.unsplash.com/photo-1513333420772-7b64ad15ca96?w=400' }] },
  ],
};

/* ─────────────────────────────────────────────
   MAIN HOME COMPONENT
───────────────────────────────────────────── */
const Home = () => {
  useGlobalStyles();
  useScrollReveal();

  const contactLenses = data.products?.filter(p => p.category === 'contact-lenses')?.length > 0
    ? data.products.filter(p => p.category === 'contact-lenses')
    : SAMPLE.contactLenses;
  const men = data.products?.filter(p => p.category === 'men')?.length > 0
    ? data.products.filter(p => p.category === 'men')
    : SAMPLE.men;
  const women = data.products?.filter(p => p.category === 'women')?.length > 0
    ? data.products.filter(p => p.category === 'women')
    : SAMPLE.women;
  const kids = data.products?.filter(p => p.category === 'kids')?.length > 0
    ? data.products.filter(p => p.category === 'kids')
    : SAMPLE.kids;

  return (
    <>
      <Hero />
      <TopCategories />
      <Features />
      
      <ProductSection title="Contact Lenses" subtitle="Daily & monthly disposables" products={contactLenses} tag="👁️ Vision" />
      <ProductSection title="Men's Collection" subtitle="Bold, refined frames" products={men} tag="👔 For Him" />
      <ProductSection title="Women's Collection" subtitle="Elegant designs" products={women} tag="💃 For Her" />
      <ProductSection title="Kids' Collection" subtitle="Durable & flexible" products={kids} tag="🧸 For Kids" />
      
      <CTASection />
      <Testimonials />
      <Newsletter />
      <FloatingWA />
    </>
  );
};

export default Home;