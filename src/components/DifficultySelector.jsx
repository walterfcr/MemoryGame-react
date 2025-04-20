import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import Layout from './Layout'; 
import "./DifficultySelector.css";
import { useTranslation } from 'react-i18next';

const DifficultySelector = ({ onSelect }) => {
  const { t } = useTranslation();
  const [selectedDifficulty, setSelectedDifficulty] = useState(
    localStorage.getItem("selectedDifficulty") || null
  );
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    document.title = "Memory Game - Select Difficulty"; // Update the browser title
    gsap.from(containerRef.current, {
      x: "100vw",
      opacity: 0,
      duration: 0.6,
      ease: "power3.out",
    });
  }, []);

  const getLogoByDifficulty = (difficulty) => {
    switch (difficulty) {
      case "Medium":
        return "/images/difficulty-logo2.png";
      case "Hard":
        return "/images/difficulty-logo3.png";
      default:
        return "/images/difficulty-logo1.png";
    }
  };

  const handleSelect = (difficulty) => {
    setSelectedDifficulty(difficulty);
    localStorage.setItem("selectedDifficulty", difficulty);
    if (onSelect) {
      onSelect(difficulty);
    }
  };

  return (
    <Layout
      title={t("SelectDifficulty")} // Only set title here
      onBackClick={() => navigate("/")} // Back button to navigate to home
    >
      <div className="difficultyContainer" ref={containerRef}>
        {/* Render the difficulty logos and options */}
        <img src={getLogoByDifficulty(selectedDifficulty)} alt="Logo" />
        <button className="tabButtonDifficulty" onClick={() => handleSelect("Easy")}>
        {t("easy")}
        </button>
        <button className="tabButtonDifficulty" onClick={() => handleSelect("Medium")}>
        {t("medium")}
        </button>
        <button className="tabButtonDifficulty" onClick={() => handleSelect("Hard")}>
        {t("hard")}
        </button>
      </div>
    </Layout>
  );
};

export default DifficultySelector;
