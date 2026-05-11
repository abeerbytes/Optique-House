import React, { useState, useEffect, useRef } from "react";

const PURPLE = "#5B3A8A";
const TEAL = "#00A99D";

const teamMembers = [
  { name: "Danish Tariq", role: "Managing Director", icon: "👔", desc: "Leading Optique House with a commitment to professional excellence, modern eye care, and a customer-first culture at every level." },
  { name: "Dr. Amina Shaikh", role: "Chief Optometrist", icon: "👁️", desc: "15+ years of clinical expertise in refractive vision care, specialty contact lenses, and advanced optical diagnostics." },
  { name: "Sana Mirza", role: "Patient Care Specialist", icon: "💎", desc: "Ensuring every visit feels personal, comfortable, and truly transformative — from consultation to eyewear selection." },
];

const values = [
  { icon: "🔬", label: "Precision", text: "Modern eye-testing equipment and trained staff ensure every prescription is accurate and every lens crafted to exacting standards." },
  { icon: "✨", label: "Quality", text: "High-quality branded lenses and frames — international standards, curated for every style and budget." },
  { icon: "❤️", label: "Care", text: "A customer-focused approach with reliable after-sales support. Your long-term eye health is our lifelong commitment." },
  { icon: "🌍", label: "Trust", text: "Rooted in Karachi, built on a reputation for professionalism, affordability, and genuine dedication to better vision." },
];

const stats = [
  { num: "12+", label: "Years of Care" },
  { num: "8K+", label: "Happy Clients" },
  { num: "500+", label: "Frame Styles" },
];

const services = [
  { icon: "🔍", label: "Professional Eye Examination" },
  { icon: "👓", label: "Prescription Glasses" },
  { icon: "🕶️", label: "Sunglasses with UV Protection" },
  { icon: "👁️", label: "Contact Lenses" },
  { icon: "💻", label: "Blue Light Protection Lenses" },
  { icon: "🔧", label: "Frame Adjustment & Lens Replacement" },
];

const products = [
  { icon: "🖼️", label: "Premium Optical Frames", sub: "Men, Women & Kids" },
  { icon: "⚙️", label: "Metal & Acetate Frames", sub: "Durable & Stylish" },
  { icon: "🔭", label: "Single Vision, Bifocal & Progressive Lenses", sub: "All prescriptions covered" },
  { icon: "✨", label: "Anti-Reflection & Scratch-Resistant Lenses", sub: "Long-lasting clarity" },
  { icon: "🕶️", label: "Fashion & Protective Sunglasses", sub: "UV & style protection" },
];

// Custom hook for fade-up animation on scroll
function useFadeUp() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function FadeUp({ children, delay = 0 }) {
  const [ref, visible] = useFadeUp();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s cubic-bezier(0.2, 0.9, 0.4, 1.1) ${delay}s, transform 0.7s cubic-bezier(0.2, 0.9, 0.4, 1.1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// Animated gradient background component that creates a subtle moving effect
function AnimatedGradientBg() {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 0,
      pointerEvents: "none",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        background: `radial-gradient(circle at 20% 30%, ${PURPLE}08 0%, transparent 50%),
                     radial-gradient(circle at 80% 70%, ${TEAL}06 0%, transparent 55%),
                     radial-gradient(circle at 40% 80%, ${PURPLE}04 0%, transparent 60%),
                     radial-gradient(circle at 70% 20%, ${TEAL}05 0%, transparent 50%)`,
        animation: "softDrift 18s infinite alternate ease-in-out",
      }} />
      <div style={{
        position: "absolute",
        width: "150%",
        height: "150%",
        top: "-25%",
        left: "-25%",
        background: `radial-gradient(ellipse at 30% 40%, ${PURPLE}10 0%, transparent 60%)`,
        animation: "slowRotate 32s infinite alternate",
        opacity: 0.4,
      }} />
      <style>{`
        @keyframes softDrift {
          0% { transform: translate(0%, 0%) scale(1); opacity: 0.5; }
          100% { transform: translate(3%, 2%) scale(1.08); opacity: 1; }
        }
        @keyframes slowRotate {
          0% { transform: rotate(0deg) scale(1); }
          100% { transform: rotate(6deg) scale(1.12); }
        }
      `}</style>
    </div>
  );
}

// Floating particles / optical illusion sparkles
function FloatingParticles() {
  const [particlePositions, setParticlePositions] = useState(() => 
    Array.from({ length: 28 }, () => ({ x: Math.random() * 100, y: Math.random() * 100, size: 2 + Math.random() * 5, delay: Math.random() * 10 }))
  );
  
  useEffect(() => {
    const interval = setInterval(() => {
      setParticlePositions(prev => prev.map(p => ({
        ...p,
        x: p.x + (Math.random() - 0.5) * 0.6,
        y: p.y + (Math.random() - 0.5) * 0.4,
      })));
    }, 3800);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, overflow: "hidden" }}>
      {particlePositions.map((p, idx) => (
        <div
          key={idx}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: idx % 3 === 0 ? TEAL : PURPLE,
            opacity: 0.2 + Math.sin(Date.now() * 0.001 + idx) * 0.1,
            boxShadow: `0 0 6px ${idx % 2 === 0 ? TEAL : PURPLE}`,
            transition: "left 4s ease-out, top 5s ease-out",
            filter: "blur(0.4px)",
          }}
        />
      ))}
    </div>
  );
}

function OptiqueLogoSVG() {
  return (
    <svg viewBox="0 0 340 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 280, margin: "0 auto" }}>
      <circle cx="34" cy="42" r="28" stroke={PURPLE} strokeWidth="5.5" fill="none" />
      <path d="M62 42 Q74 28 86 42" stroke={PURPLE} strokeWidth="5" fill="none" strokeLinecap="round" />
      <text x="88" y="62" fontFamily="Georgia,serif" fontSize="46" fontWeight="700" fill={PURPLE}>PTI</text>
      <text x="184" y="62" fontFamily="Georgia,serif" fontSize="46" fontWeight="700" fill={TEAL}>QUE</text>
      <line x1="6" y1="42" x2="0" y2="32" stroke={PURPLE} strokeWidth="4.5" strokeLinecap="round" />
      <text x="190" y="83" fontFamily="Georgia,serif" fontSize="19" fontStyle="italic" fill="#ccc">House</text>
      <text x="190" y="97" fontFamily="Arial,sans-serif" fontSize="11" fill="#aaa" letterSpacing="1.5">Vision is Life</text>
    </svg>
  );
}

export default function About() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredTeam, setHoveredTeam] = useState(null);
  const [hoveredService, setHoveredService] = useState(null);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  const grad = `linear-gradient(135deg, ${PURPLE}, ${TEAL})`;
 useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div style={{ fontFamily: "Georgia, serif", background: "#FAFAF8", color: "#2C2C2C", minHeight: "100vh", overflowX: "hidden", position: "relative" }}>
      <AnimatedGradientBg />
      <FloatingParticles />
      
      <div style={{ position: "relative", zIndex: 2 }}>

        {/* ── HERO ── */}
        <section style={{ background: "rgba(245, 243, 239, 0.82)", backdropFilter: "blur(2px)", padding: "48px 20px 64px 20px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", width: 520, height: 520, top: -180, right: -120, background: `radial-gradient(circle, ${TEAL}18 0%, transparent 70%)`, borderRadius: "50%", pointerEvents: "none", animation: "pulseGlow 12s infinite alternate" }} />
          <div style={{ position: "absolute", width: 360, height: 360, bottom: -120, left: -80, background: `radial-gradient(circle, ${PURPLE}12 0%, transparent 70%)`, borderRadius: "50%", pointerEvents: "none", animation: "pulseGlow 15s infinite alternate-reverse" }} />

          <div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 48, alignItems: "center" }}>
              <FadeUp>
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 11, fontFamily: "Arial,sans-serif", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: TEAL, marginBottom: 20 }}>
                    <div style={{ width: 28, height: 2, background: grad, borderRadius: 2 }} />
                    Our Story
                  </div>
                  <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(36px, 6vw, 60px)", fontWeight: 700, lineHeight: 1.15, color: "#1C1C1C", marginBottom: 20 }}>
                    Vision Is Not<br />Just Sight —{" "}
                    <span style={{ background: grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>It's Life.</span>
                  </h1>
                  <p style={{ fontFamily: "Arial,sans-serif", fontSize: 16, fontWeight: 300, lineHeight: 1.7, color: "#5A5A5A", maxWidth: 500, marginBottom: 32 }}>
                    Located in Karachi, Optique House is managed by experienced professionals and equipped with modern eye-testing technology. We offer a complete range of optical solutions, ensuring each customer receives personalized guidance and products that meet international quality standards.
                  </p>
                  <a href="#story" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 28px", background: grad, color: "#fff", fontFamily: "Arial,sans-serif", fontSize: 14, fontWeight: 600, letterSpacing: "0.04em", border: "none", borderRadius: 50, cursor: "pointer", boxShadow: `0 8px 24px ${PURPLE}30`, textDecoration: "none", transition: "transform 0.2s, box-shadow 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 14px 32px ${PURPLE}50`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 8px 24px ${PURPLE}30`; }}>
                    Discover Our Journey →
                  </a>
                </div>
              </FadeUp>

              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div style={{ background: "#1A1A1A", borderRadius: 20, padding: "28px 20px", boxShadow: "0 16px 48px rgba(0,0,0,0.14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <OptiqueLogoSVG />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                  {stats.map((st) => (
                    <div key={st.label} style={{ background: "#fff", border: "1px solid #E8E4DE", borderRadius: 14, padding: "16px 8px", textAlign: "center" }}>
                      <div style={{ fontFamily: "Georgia,serif", fontSize: 28, fontWeight: 700, background: grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", lineHeight: 1.2, marginBottom: 4 }}>{st.num}</div>
                      <div style={{ fontFamily: "Arial,sans-serif", fontSize: 9, color: "#9A9A9A", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>{st.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div style={{ height: 1, background: "#E8E4DE", maxWidth: 1200, margin: "0 auto" }} />

        {/* ── STORY ── */}
        <section id="story" style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 20px 72px 20px", position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 56, alignItems: "center" }}>
            <FadeUp>
              <div>
                <div style={{ fontFamily: "Arial,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: PURPLE, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 40, height: 1, background: `linear-gradient(90deg, ${PURPLE}, transparent)` }} />
                  Who We Are
                </div>
                <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, lineHeight: 1.2, color: "#1C1C1C", marginBottom: 22 }}>
                  Born from a Passion<br />for <em style={{ color: TEAL }}>Perfect Vision</em>
                </h2>
                <div style={{ fontFamily: "Arial,sans-serif", fontSize: 15, fontWeight: 300, lineHeight: 1.8, color: "#5A5A5A" }}>
                  <p>Optique House is a professional optical store dedicated to providing premium eye care solutions and high-quality eyewear. With a strong focus on accuracy, comfort, and style, we serve customers with modern optical products and reliable services designed to enhance vision and confidence.</p>
                  <p style={{ marginTop: 16 }}>Located in Karachi and managed by experienced professionals, we are equipped with modern eye-testing technology to ensure every customer receives personalized guidance and products that meet international quality standards.</p>
                  <p style={{ marginTop: 16 }}>From our very first day, we set out to redefine what it means to visit an optician — combining world-class diagnostics with a lovingly curated eyewear boutique, all while keeping care affordable and accessible.</p>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.15}>
              <div style={{ background: "#fff", borderRadius: 20, padding: "28px 24px", border: "1px solid #E8E4DE", boxShadow: "0 12px 40px rgba(0,0,0,0.06)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: grad }} />
                <p style={{ fontFamily: "Georgia,serif", fontSize: 18, fontStyle: "italic", lineHeight: 1.65, color: "#2C2C2C", marginBottom: 24 }}>
                  <span style={{ fontSize: 58, lineHeight: 0, verticalAlign: -20, color: TEAL, fontStyle: "normal", marginRight: 4 }}>"</span>
                  Vision is life — every pair of eyes deserves to experience the world with absolute clarity and beauty.
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>👔</div>
                  <div>
                    <div style={{ fontFamily: "Arial,sans-serif", fontWeight: 600, fontSize: 14, color: "#2C2C2C" }}>Danish Tariq</div>
                    <div style={{ fontFamily: "Arial,sans-serif", fontSize: 11, color: "#9A9A9A", marginTop: 2 }}>Managing Director, Optique House</div>
                  </div>
                </div>
                <div style={{ position: "absolute", bottom: -18, right: -18, width: 88, height: 88, borderRadius: "50%", background: grad, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff", boxShadow: `0 10px 28px ${PURPLE}35` }}>
                  <div style={{ fontFamily: "Georgia,serif", fontSize: 24, fontWeight: 700, lineHeight: 1 }}>12</div>
                  <div style={{ fontFamily: "Arial,sans-serif", fontSize: 7, textAlign: "center", opacity: 0.9, letterSpacing: "0.05em", textTransform: "uppercase", marginTop: 2 }}>Years of Excellence</div>
                </div>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ── MISSION & VISION ── */}
        <div style={{ background: "#1C1C1C", padding: "64px 24px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${PURPLE}20, ${TEAL}15)`, pointerEvents: "none" }} />
          <FadeUp>
            <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 48 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "Arial,sans-serif", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: TEAL, fontWeight: 600, marginBottom: 16 }}>Our Mission</div>
                <p style={{ fontFamily: "Georgia,serif", fontSize: "clamp(16px, 2.5vw, 22px)", fontStyle: "italic", fontWeight: 400, lineHeight: 1.6, color: "#fff" }}>
                  To provide{" "}
                  <strong style={{ fontStyle: "normal", fontWeight: 700, background: grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>accurate eye care solutions</strong>{" "}
                  and stylish, high-quality eyewear that improves vision and quality of life, while maintaining affordability and customer trust.
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 1, height: "100%", minHeight: 80, background: `linear-gradient(180deg, transparent, ${TEAL}60, transparent)` }} />
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "Arial,sans-serif", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: TEAL, fontWeight: 600, marginBottom: 16 }}>Our Vision</div>
                <p style={{ fontFamily: "Georgia,serif", fontSize: "clamp(16px, 2.5vw, 22px)", fontStyle: "italic", fontWeight: 400, lineHeight: 1.6, color: "#fff" }}>
                  To become a{" "}
                  <strong style={{ fontStyle: "normal", fontWeight: 700, background: grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>trusted and recognized optical brand</strong>{" "}
                  known for professionalism, quality products, and excellent customer service.
                </p>
              </div>
            </div>
          </FadeUp>
        </div>

        {/* ── VALUES / WHY CHOOSE ── */}
        <section style={{ background: "rgba(245, 243, 239, 0.86)", backdropFilter: "blur(2px)", padding: "72px 20px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <FadeUp>
              <div style={{ textAlign: "center", marginBottom: 56 }}>
                <div style={{ fontFamily: "Arial,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: PURPLE, marginBottom: 16 }}>Why Choose Us</div>
                <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, lineHeight: 1.2, color: "#1C1C1C" }}>
                  Our <em style={{ color: TEAL }}>Core Values</em>
                </h2>
              </div>
            </FadeUp>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
              {values.map((v, i) => (
                <FadeUp key={v.label} delay={i * 0.07}>
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 18,
                      padding: "28px 20px",
                      border: hoveredCard === i ? `1px solid ${TEAL}` : "1px solid #E8E4DE",
                      borderBottom: hoveredCard === i ? `3px solid ${TEAL}` : "1px solid #E8E4DE",
                      transition: "transform 0.22s, box-shadow 0.22s, border 0.2s",
                      transform: hoveredCard === i ? "translateY(-6px)" : "translateY(0)",
                      boxShadow: hoveredCard === i ? "0 18px 44px rgba(0,0,0,0.09)" : "none",
                      cursor: "default",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                    onMouseEnter={() => setHoveredCard(i)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <span style={{ fontSize: 28, display: "block", marginBottom: 14 }}>{v.icon}</span>
                    <div style={{ fontFamily: "Georgia,serif", fontSize: 20, fontWeight: 700, color: "#1C1C1C", marginBottom: 8 }}>{v.label}</div>
                    <p style={{ fontFamily: "Arial,sans-serif", fontSize: 13, lineHeight: 1.65, color: "#5A5A5A", fontWeight: 300, margin: 0 }}>{v.text}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ── SERVICES ── */}
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 20px" }}>
          <FadeUp>
            <div style={{ marginBottom: 48, textAlign: "center" }}>
              <div style={{ fontFamily: "Arial,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: PURPLE, marginBottom: 16 }}>What We Offer</div>
              <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, lineHeight: 1.2, color: "#1C1C1C" }}>
                Our <em style={{ color: TEAL }}>Services</em>
              </h2>
            </div>
          </FadeUp>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {services.map((s, i) => (
              <FadeUp key={s.label} delay={i * 0.06}>
                <div
                  style={{
                    background: hoveredService === i ? "#fff" : "#FAFAF8",
                    border: hoveredService === i ? `1px solid ${TEAL}` : "1px solid #E8E4DE",
                    borderLeft: `4px solid ${hoveredService === i ? TEAL : PURPLE}`,
                    borderRadius: 14,
                    padding: "20px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    transition: "all 0.22s",
                    transform: hoveredService === i ? "translateX(6px)" : "translateX(0)",
                    boxShadow: hoveredService === i ? "0 8px 28px rgba(0,0,0,0.07)" : "none",
                    cursor: "default",
                    height: "100%",
                  }}
                  onMouseEnter={() => setHoveredService(i)}
                  onMouseLeave={() => setHoveredService(null)}
                >
                  <span style={{ fontSize: 28, flexShrink: 0 }}>{s.icon}</span>
                  <div style={{ fontFamily: "Arial,sans-serif", fontSize: 15, fontWeight: 500, color: "#2C2C2C", lineHeight: 1.4 }}>{s.label}</div>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* ── PRODUCTS ── */}
        <section style={{ background: "rgba(245, 243, 239, 0.86)", padding: "72px 20px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <FadeUp>
              <div style={{ marginBottom: 48, textAlign: "center" }}>
                <div style={{ fontFamily: "Arial,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: PURPLE, marginBottom: 16 }}>Our Range</div>
                <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, lineHeight: 1.2, color: "#1C1C1C" }}>
                  Our <em style={{ color: TEAL }}>Products</em>
                </h2>
              </div>
            </FadeUp>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
              {products.map((p, i) => (
                <FadeUp key={p.label} delay={i * 0.07}>
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 16,
                      padding: "24px 20px",
                      border: hoveredProduct === i ? `1px solid ${PURPLE}` : "1px solid #E8E4DE",
                      transition: "transform 0.22s, box-shadow 0.22s",
                      transform: hoveredProduct === i ? "translateY(-5px)" : "translateY(0)",
                      boxShadow: hoveredProduct === i ? "0 14px 36px rgba(0,0,0,0.08)" : "none",
                      cursor: "default",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                    onMouseEnter={() => setHoveredProduct(i)}
                    onMouseLeave={() => setHoveredProduct(null)}
                  >
                    <span style={{ fontSize: 32, display: "block", marginBottom: 12 }}>{p.icon}</span>
                    <div style={{ fontFamily: "Georgia,serif", fontSize: 17, fontWeight: 700, color: "#1C1C1C", marginBottom: 6 }}>{p.label}</div>
                    <div style={{ fontFamily: "Arial,sans-serif", fontSize: 12, color: TEAL, fontWeight: 500, marginTop: "auto" }}>{p.sub}</div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ── TEAM ── */}
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 20px 80px 20px" }}>
          <FadeUp>
            <div style={{ marginBottom: 48 }}>
              <div style={{ fontFamily: "Arial,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: PURPLE, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 40, height: 1, background: `linear-gradient(90deg, ${PURPLE}, transparent)` }} />
                The People Behind the Lens
              </div>
              <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, lineHeight: 1.2, color: "#1C1C1C" }}>
                Meet Our <em style={{ color: TEAL }}>Team</em>
              </h2>
            </div>
          </FadeUp>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 28 }}>
            {teamMembers.map((m, i) => (
              <FadeUp key={m.name} delay={i * 0.1}>
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 20,
                    overflow: "hidden",
                    border: "1px solid #E8E4DE",
                    transition: "transform 0.22s, box-shadow 0.22s",
                    transform: hoveredTeam === i ? "translateY(-5px)" : "translateY(0)",
                    boxShadow: hoveredTeam === i ? "0 18px 44px rgba(0,0,0,0.09)" : "none",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  onMouseEnter={() => setHoveredTeam(i)}
                  onMouseLeave={() => setHoveredTeam(null)}
                >
                  <div style={{ height: 130, background: grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52 }}>{m.icon}</div>
                  <div style={{ padding: "24px 20px", flex: 1 }}>
                    <div style={{ fontFamily: "Georgia,serif", fontSize: 20, fontWeight: 700, color: "#1C1C1C", marginBottom: 6 }}>{m.name}</div>
                    <div style={{ fontFamily: "Arial,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: TEAL, marginBottom: 14 }}>{m.role}</div>
                    <p style={{ fontFamily: "Arial,sans-serif", fontSize: 13, lineHeight: 1.65, color: "#5A5A5A", fontWeight: 300, margin: 0 }}>{m.desc}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* ── QUALITY & COMMITMENT BANNER ── */}
        <div style={{ background: "#1C1C1C", padding: "56px 24px", position: "relative", overflow: "hidden", textAlign: "center" }}>
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${PURPLE}20, ${TEAL}15)`, pointerEvents: "none" }} />
          <FadeUp>
            <div style={{ position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto" }}>
              <div style={{ fontFamily: "Arial,sans-serif", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: TEAL, fontWeight: 600, marginBottom: 16 }}>Quality & Commitment</div>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "clamp(18px, 3vw, 28px)", fontStyle: "italic", fontWeight: 400, lineHeight: 1.55, color: "#fff" }}>
                At Optique House, quality and accuracy are our priorities. Every product and service is delivered with{" "}
                <strong style={{ fontStyle: "normal", fontWeight: 700, background: grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>attention to detail</strong>,
                ensuring customer satisfaction and long-term eye health.
              </p>
            </div>
          </FadeUp>
        </div>

        {/* ── FOOTER ── */}
        <footer style={{ padding: "40px 20px 32px 20px", textAlign: "center", fontSize: 12, color: "#888", fontFamily: "Arial,sans-serif", borderTop: "1px solid #E8E4DE", background: "#FAFAF8" }}>
          <p>© 2025 Optique House — Precision, Quality & Care for Your Vision</p>
        </footer>
      </div>
      <style>{`
        @keyframes pulseGlow {
          0% { opacity: 0.3; transform: scale(1); }
          100% { opacity: 0.8; transform: scale(1.08); }
        }
      `}</style>
    </div>
  );
}