import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import Layout from './Layout';
import './LanguageSelector.css';

function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const clickSound = useRef(new Audio("/sounds/click.wav"));
  const [language, setLanguage] = useState(i18n.language || 'en');

  useEffect(() => {
    gsap.from(containerRef.current, {
      x: "100vw",
      opacity: 0,
      duration: 0.6,
      ease: "power3.out"
    });
  }, []);

  const playClickSound = () => {
    clickSound.current.currentTime = 0;
    clickSound.current.play();
  };

  const handleBack = () => {
    playClickSound();
    navigate("/");
  };

  const changeLanguage = (lng) => {
    playClickSound();
    setLanguage(lng);
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
  };

  const getLogoImage = () => {
    switch (language) {
      case 'es':
        return '/images/language-logo2.png';
      case 'fr':
        return '/images/language-logo3.png';
      case 'en':
      default:
        return '/images/language-logo1.png';
    }
  };

  return (
    <Layout title={t("selectLanguage")} onBackClick={handleBack}>
      <div ref={containerRef} className="languageContainer">
        <h1>{t("selectLanguage")}</h1>
        <img src={getLogoImage()} alt="Language Logo" className="logoImage" />
        <button className="tabButtonLanguage" onClick={() => changeLanguage('en')}>
          English
        </button>
        <button className="tabButtonLanguage" onClick={() => changeLanguage('es')}>
          Español
        </button>
        <button className="tabButtonLanguage" onClick={() => changeLanguage('fr')}>
          Français
        </button>
      </div>
    </Layout>
  );
}

export default LanguageSelector;
