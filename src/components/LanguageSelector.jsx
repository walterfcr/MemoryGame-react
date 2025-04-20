import React, { useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import Layout from './Layout';
import { gsap } from 'gsap'; // Import GSAP for animation

export function LanguageSelector() {
  const navigate = useNavigate();
  const containerRef = useRef(null); // Ref for animation

  useEffect(() => {
    gsap.from(containerRef.current, {
      x: "100vw",        // Start off-screen to the right
      opacity: 0,        // Fade in
      duration: 0.6,     // Animation duration
      ease: "power3.out" // Easing function for smooth animation
    });
  }, []);

  return (
    <Layout title="Select Language" onBackClick={() => navigate("/")}>
      <div ref={containerRef} className="languageSelectorContent">
        {/* Add your language options or dropdowns here */}
        <p>Select your preferred language here.</p>
      </div>
    </Layout>
  );
}

export default LanguageSelector;
