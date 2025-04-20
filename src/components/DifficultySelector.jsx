import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import Layout from './Layout'; 
import "./DifficultySelector.css";

const DifficultySelector = ({ onSelect }) => {
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
      title="Select Difficulty" // Only set title here
      onBackClick={() => navigate("/")} // Back button to navigate to home
    >
      <div className="difficultyContainer" ref={containerRef}>
        {/* Render the difficulty logos and options */}
        <img src={getLogoByDifficulty(selectedDifficulty)} alt="Logo" />
        <button className="tabButtonDifficulty" onClick={() => handleSelect("Easy")}>
          Easy
        </button>
        <button className="tabButtonDifficulty" onClick={() => handleSelect("Medium")}>
          Medium
        </button>
        <button className="tabButtonDifficulty" onClick={() => handleSelect("Hard")}>
          Hard
        </button>
      </div>
    </Layout>
  );
};

export default DifficultySelector;
