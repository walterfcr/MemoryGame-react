import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DifficultySelector.css";

const DifficultySelector = ({ onSelect }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState(
    localStorage.getItem("selectedDifficulty") || null
  );
  const navigate = useNavigate();

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
    <main>
      <div className="titleHeader">
        <h2>Select Difficulty</h2>
        <button className="backButton" onClick={() => navigate("/")}>
          ⬅ Back
        </button>
      </div>
      <div className="difficultyContainer">
        <img src={getLogoByDifficulty(selectedDifficulty)} alt="Logo" />
        <button
          className="tabButtonDifficulty"
          onClick={() => handleSelect("Easy")}
        >
          Easy
        </button>
        <button
          className="tabButtonDifficulty"
          onClick={() => handleSelect("Medium")}
        >
          Medium
        </button>
        <button
          className="tabButtonDifficulty"
          onClick={() => handleSelect("Hard")}
        >
          Hard
        </button>
      </div>
    </main>
  );
};

export default DifficultySelector;
