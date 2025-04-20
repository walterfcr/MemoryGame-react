import React, { useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import Layout from './Layout'; // Import the Layout component
import { gsap } from 'gsap'; // Import GSAP for animation
import { useTranslation } from 'react-i18next';

export function Credits() {
  const { t } = useTranslation();
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
    <Layout
      title={t("credits")} // Layout handles the title
      onBackClick={() => navigate("/")} // Back button functionality
    >
      <div ref={containerRef} className="creditsContent">
        <p>Some credits or information about the game.</p>
        {/* You can add more content here related to the credits */}
      </div>
    </Layout>
  );
}

export default Credits;
