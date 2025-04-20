import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CategorySelector.css";

const CategorySelector = () => {
  const [selectedCategory, setSelectedCategory] = useState(
    localStorage.getItem("selectedCategory") || "heroes"
  );

  const handleSelect = (category) => {
    setSelectedCategory(category);
    localStorage.setItem("selectedCategory", category);
  };

  const navigate = useNavigate();

  const getLogoByCategory = (category) => {
    switch (category) {
      case "movies":
        return "/images/themes-logo2.png";
      case "musicians":
        return "/images/themes-logo4.png";
      case "videogames":
        return "/images/themes-logo3.png";
      default:
        return "/images/themes-logo1.png";
    }
  };

  return (
    <main>
      <div className="titleHeader">
        <h2>Select Category</h2>
        <button className="backButton" onClick={() => navigate("/")}>
          ⬅ Back
        </button>
      </div>
      <div className="categoryContainer">
        <img src={getLogoByCategory(selectedCategory)} alt="Logo" />
        <button
          className="tabButtonCategory"
          onClick={() => handleSelect("heroes")}
        >
          Heroes
        </button>
        <button
          className="tabButtonCategory"
          onClick={() => handleSelect("movies")}
        >
          Movies
        </button>
        <button
          className="tabButtonCategory"
          onClick={() => handleSelect("musicians")}
        >
          Musicians
        </button>
        <button
          className="tabButtonCategory"
          onClick={() => handleSelect("videogames")}
        >
          Video Games
        </button>
      </div>
    </main>
  );
};

export default CategorySelector;
