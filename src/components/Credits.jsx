import React, { useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import Layout from './Layout'; // Import the Layout component
import { gsap } from 'gsap'; // Import GSAP for animation
import { useTranslation } from 'react-i18next';
import './Credits.css';

export function Credits() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const containerRef = useRef(null); // Ref for animation
  const clickSound = useRef(new Audio("/sounds/click.wav")); // Sound reference

  useEffect(() => {
    gsap.from(containerRef.current, {
      x: "100vw",        // Start off-screen to the right
      opacity: 0,        // Fade in
      duration: 0.6,     // Animation duration
      ease: "power3.out" // Easing function for smooth animation
    });
  }, []);

  const handleBack = () => {
    clickSound.current.currentTime = 0;
    clickSound.current.play();
    navigate("/");
  };

  return (
    <Layout
      title={t("credits")} 
      onBackClick={handleBack}
    >
      <div ref={containerRef} className="creditsContent">
      <img src="/images/credits-logo.png" alt="Logo" className="logoImage" />
        
        <p>{t("inspired")}</p>
        <p>{t("project")}</p>
        <p>{t("developed")}</p>
        <p>{t("version")}</p>
        <p>{t("built")}</p>
        <p>{t("sound")}</p>
        <p>{t("contact")}</p>
      </div>
    </Layout>
  );
}

export default Credits;
