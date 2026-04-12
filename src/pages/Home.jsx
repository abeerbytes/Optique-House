// components/Home.js
import React, { useEffect, useRef, useState } from 'react';
import ProductCard from '../components/ProductCard';
import data from '../data/data.json';
import { Gem, Box, Headset, RotateCcw } from 'lucide-react';

/* ─────────────────────────────────────────────
   GLOBAL STYLES - Light Theme with Gradient & Glass
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

  /* Category circle */
  .cat-circle {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid var(--gold);
    padding: 3px;
    transition: transform 0.2s var(--ease);
  }

  .cat-circle:hover {
    transform: translateY(-4px);
  }

  /* Product card overrides */
  .product-glass {
    background: var(--glass-white);
    backdrop-filter: blur(8px);
    border-radius: 20px;
    padding: 1rem;
    transition: all 0.2s var(--ease);
  }

  /* WhatsApp floating */
  @keyframes waPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.5); }
    50% { box-shadow: 0 0 0 12px rgba(37, 211, 102, 0); }
  }
  .wa-btn {
    animation: waPulse 2s infinite;
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
   SIMPLE HERO - Light & Gradient
───────────────────────────────────────────── */
const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: './ban1.jpeg', // Replace with your image paths
      title: '',
      subtitle: '',
      tagline: ''
    },
    {
      image: './ban2.jpeg',
      title: '',
      subtitle: '',
      tagline: ''
    }
  ];

  // Auto-slide logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section style={{
      height: '90vh',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#f5f5f5' // Fallback color
    }}>
      {/* Background Images / Carousel */}
      {slides.map((slide, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: currentSlide === index ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
            zIndex: 1
          }}
        />
      ))}

      {/* Content Overlay */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingLeft: '10%', // Aligns text to the left like the image
        color: '#fff', // Change to #000 if your images are light
        textShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          fontWeight: 400,
          letterSpacing: '0.05em',
          margin: 0,
          lineHeight: 1.1,
          textTransform: 'uppercase'
        }}>
          {slides[currentSlide].title}<br />
          <span style={{ fontWeight: 700 }}>{slides[currentSlide].subtitle}</span>
        </h1>
        
        <div style={{
          width: '60px',
          height: '2px',
          backgroundColor: '#fff',
          margin: '2rem 0'
        }} />

        <p style={{
          fontSize: '1rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          fontWeight: 500
        }}>
          {slides[currentSlide].tagline}
        </p>
      </div>

      {/* Carousel Indicators (The dots at the bottom) */}
      <div style={{
        position: 'absolute',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '12px',
        zIndex: 3
      }}>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
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
   CATEGORY CIRCLES (Glass)
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
    <section className="categories-section">
      <div className="container">
        <h2 className="section-title">Top Categories</h2>
        
        <div className="categories-grid">
          {cats.map((cat, i) => (
            <div key={i} className="category-card">
              <div className="image-wrapper">
                <img src={cat.img} alt={cat.name} />
              </div>
              <p className="category-name">{cat.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   FEATURE CARDS (Glass)
───────────────────────────────────────────── */
const Features = () => {
  const features = [
    { 
      icon: <Gem size={40} strokeWidth={1} />, 
      title: 'PREMIUM QUALITY', 
      desc: 'Premium Quality Frames & Lenses' 
    },
    { 
      icon: <Box size={40} strokeWidth={1} />, 
      title: 'DELIVERING WORLDWIDE', 
      desc: 'Order now and get your deliveries worldwide' 
    },
    { 
      icon: <Headset size={40} strokeWidth={1} />, 
      title: 'SUPPORT 24/7', 
      desc: "Contact us! We're available 24/7" 
    },
    { 
      icon: <RotateCcw size={40} strokeWidth={1} />, 
      title: 'RETURN & EXCHANGE', 
      desc: 'Easy 7 Days Exchange Policy' 
    },
  ];

  return (
    <section style={{ padding: '4rem 1rem', backgroundColor: '#fff' }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '2rem' 
      }}>
        {features.map((f, i) => (
          <div key={i} style={{ textAlign: 'center', color: '#1a1a1a' }}>
            {/* Icon Container */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              marginBottom: '1.5rem',
              color: '#333'
            }}>
              {f.icon}
            </div>

            {/* Title - Uppercase and Bold */}
            <h4 style={{ 
              fontSize: '1.1rem', 
              fontWeight: '600', 
              letterSpacing: '1px',
              textTransform: 'uppercase',
              margin: '0 0 0.75rem 0' 
            }}>
              {f.title}
            </h4>

            {/* Description - Lighter and Muted */}
            <p style={{ 
              fontSize: '0.95rem', 
              color: '#777', 
              fontWeight: '300',
              lineHeight: '1.4',
              margin: 0 
            }}>
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   PRODUCT SECTION with Horizontal Scroll
───────────────────────────────────────────── */
const ProductSection = ({ title, products }) => {
  const trackRef = useRef(null);

  const scroll = (direction) => {
    if (trackRef.current) {
      // Logic to scroll by roughly one card width
      const scrollAmount = direction === 'left' ? -340 : 340;
      trackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!products?.length) return null;

  return (
    <section className="min-h-screen w-full py-16 bg-white flex items-center justify-center">
      {/* Main container - centered both horizontally and vertically */}
      <div className="w-full max-w-[1320px] mx-auto px-4 md:px-6 relative">
        
        {/* Header - centered text on mobile, left-aligned on larger screens */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 text-center md:text-left">
            {title}
          </h2>
          {/* View All button - centered on mobile, right-aligned on desktop */}
          <button className="text-sm font-semibold text-gray-600 hover:text-black transition-colors underline underline-offset-4">
            View All
          </button>
        </div>

        {/* 2. Navigation Arrows: Centered with the carousel */}
        <div className="relative">
          <div className="hidden md:block">
            <button 
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 bg-white border border-gray-200 rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-gray-50 transition-all active:scale-95"
              aria-label="Scroll Left"
            >
              <span className="text-2xl">‹</span>
            </button>

            <button 
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-30 bg-white border border-gray-200 rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-gray-50 transition-all active:scale-95"
              aria-label="Scroll Right"
            >
              <span className="text-2xl">›</span>
            </button>
          </div>

          {/* 3. Horizontal Scroll Track with centered items */}
          <div 
            ref={trackRef}
            className="flex overflow-x-auto gap-6 no-scrollbar pb-8 snap-x snap-mandatory justify-center"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none' 
            }}
          >
            {products.map((product) => (
              <div 
                key={product.id} 
                className="min-w-[280px] md:min-w-[310px] flex-shrink-0 snap-start"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Global CSS for the custom scrollbar behavior */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};
/* ─────────────────────────────────────────────
   SIMPLE CALL TO ACTION - Glass Style
───────────────────────────────────────────── */
const CTASection = () => (
  <section style={{ padding: '5rem 2rem' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div className="glass-card reveal" style={{ padding: '3rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: '1rem' }}>
          Virtual Try-On
        </h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto 1.5rem' }}>
          See how frames look on your face — from any angle — using our AI-powered tool.
        </p>
        <button className="btn-gold">Try Now →</button>
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   TESTIMONIALS (Glass Cards)
───────────────────────────────────────────── */
const Testimonials = () => {
  const reviews = [
    { name: 'Ayesha Khan', text: 'The virtual try-on was so accurate! My frames arrived in perfect condition.', rating: 5 },
    { name: 'Hassan Malik', text: 'Best collection in Pakistan. The blue light glasses have reduced my screen fatigue.', rating: 5 },
    { name: 'Sana Ahmed', text: 'Excellent quality at fair prices. Customer service was extremely helpful.', rating: 5 },
  ];
  return (
    <section style={{ padding: '5rem 2rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="tag">Testimonials</span>
          <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginTop: '0.75rem' }}>
            What Customers <span style={{ color: 'var(--gold)' }}>Say</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {reviews.map((r, i) => (
            <div key={i} className={`glass-card reveal d${i + 1}`} style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: '1rem' }}>
                {[...Array(r.rating)].map((_, j) => <span key={j} style={{ color: 'var(--gold)' }}>★</span>)}
              </div>
              <p style={{ fontStyle: 'italic', marginBottom: '1.5rem', color: 'var(--ink)' }}>"{r.text}"</p>
              <p style={{ fontWeight: 700 }}>{r.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   NEWSLETTER - Glass
───────────────────────────────────────────── */
const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  return (
    <section style={{ padding: '5rem 2rem' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div className="glass-card reveal" style={{ padding: '3rem', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.8rem', marginBottom: '0.5rem' }}>Get Exclusive Offers</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Join 50,000+ members for early access to sales.</p>
          {subscribed ? (
            <p style={{ fontWeight: 600, color: 'var(--gold)' }}>🎉 You're in! Check your inbox.</p>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email"
                style={{ flex: 1, minWidth: 200, padding: '0.8rem 1.2rem', borderRadius: '48px', border: '1px solid rgba(0,0,0,0.1)', background: 'white', fontFamily: 'var(--ff-body)' }}
              />
              <button className="btn-primary" onClick={() => email && setSubscribed(true)}>Subscribe →</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   FLOATING WHATSAPP
───────────────────────────────────────────── */
const FloatingWA = () => (
  <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer"
    className="wa-btn"
    style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      zIndex: 999,
      width: 54,
      height: 54,
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
    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style={{ width: 28, height: 28 }} />
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

  // Filter products from data.json or fallback to sample
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
      
      <ProductSection
        title="Contact Lenses"
        subtitle="Daily & monthly disposables"
        products={contactLenses}
        tag="👁️ Vision"
      />
      
      <ProductSection
        title="Men's Collection"
        subtitle="Bold, refined frames"
        products={men}
        tag="👔 For Him"
      />
      
      <ProductSection
        title="Women's Collection"
        subtitle="Elegant designs"
        products={women}
        tag="💃 For Her"
      />
      
      <ProductSection
        title="Kids' Collection"
        subtitle="Durable & flexible"
        products={kids}
        tag="🧸 For Kids"
      />
      
      <CTASection />
      <Testimonials />
      <Newsletter />
      <FloatingWA />
    </>
  );
};

export default Home;