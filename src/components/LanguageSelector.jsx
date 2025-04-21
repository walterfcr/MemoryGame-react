import React from 'react';
import { useTranslation } from 'react-i18next';
import Layout from './Layout';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';
import './LanguageSelector.css';

function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.from(containerRef.current, {
      x: "100vw",
      opacity: 0,
      duration: 0.6,
      ease: "power3.out"
    });
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
  };

  return (
    <Layout title={t("selectLanguage")} onBackClick={() => navigate("/")}>
      <div ref={containerRef} className="languageContainer">
        <img src="/images/language-logo.png" alt="Logo" className="logoImage" />
        <button className="tabButtonLanguage" onClick={() => changeLanguage('en')}><img src="/images/eu.webp" width="40" style={{ marginRight: '8px' }} />English</button>
        <button className="tabButtonLanguage" onClick={() => changeLanguage('es')}><img src="/images/es.webp" width="40" style={{ marginRight: '8px' }} />Español</button>
      </div>
    </Layout>
  );
}

export default LanguageSelector;


