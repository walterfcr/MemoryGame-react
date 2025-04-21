import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import './StartPage.css';
import { useTranslation } from 'react-i18next';

const StartPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const containerRef = useRef();

  const handleNavigate = (path) => {
    gsap.to(containerRef.current, {
      x: "-100vw",     // slide out to the left
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => navigate(path),
    });
  };

  useEffect(() => {
    gsap.from(containerRef.current, {
      opacity: 0,
      y: 30,
      duration: 0.5,
      ease: "power2.out",
    });
  }, []);

  return (
    <main>
  <div className="titleHeader">
    <h2>{t("memoryGame")}</h2>
  </div>
    <div className="startPageContainer" ref={containerRef}>
      <img src="/images/logo.png" alt="Logo" className="logoImage" />

      <div className="tabsContainer">
        <button onClick={() => handleNavigate("/login")} className="tabButton">{t("login")}</button>
        <button onClick={() => handleNavigate("/difficulty")} className="tabButton">{t("difficulty")}</button>
        <button onClick={() => handleNavigate("/categories")} className="tabButton">{t("category")}</button>
        <button onClick={() => handleNavigate("/score")} className="tabButton">{t("score")}</button>
        <button onClick={() => handleNavigate("/language")} className="tabButton">{t("language")}</button>
        <button onClick={() => handleNavigate("/credits")} className="tabButton">{t("credits")}</button>
      </div>

      <button onClick={() => handleNavigate("/play")} className="playButton">{t("play")}</button>
    </div>
    </main>
  );
};

export default StartPage;
