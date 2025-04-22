import React, { useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import Layout from './Layout'; // Reuse the Layout for consistent title/back UI
import { gsap } from 'gsap';
import { useTranslation } from 'react-i18next';

export function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const clickSound = useRef(new Audio("/sounds/click.mp3"));

  useEffect(() => {
    gsap.from(containerRef.current, {
      x: "100vw",
      opacity: 0,
      duration: 0.6,
      ease: "power3.out"
    });
  }, []);

  const handleBack = () => {
    clickSound.current.currentTime = 0;
    clickSound.current.play();
    navigate("/");
  };

  return (
    <Layout title={t("login")} onBackClick={handleBack}>
      <div ref={containerRef} className="loginContent">
        {/* Your login content goes here */}
        <p>Login form goes here.</p>
      </div>
    </Layout>
  );
}

export default Login;
