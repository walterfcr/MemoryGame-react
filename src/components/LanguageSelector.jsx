import React from 'react';
import { useTranslation } from 'react-i18next';
import Layout from './Layout';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

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
      <div ref={containerRef} className="languageSelector">
        <button onClick={() => changeLanguage('en')}>English</button>
        <button onClick={() => changeLanguage('es')}>Español</button>
      </div>
    </Layout>
  );
}

export default LanguageSelector;


