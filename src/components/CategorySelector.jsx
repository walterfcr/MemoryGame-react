import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from './Layout';
import { gsap } from 'gsap'; 
import "./CategorySelector.css";
import { useTranslation } from 'react-i18next';

const CategorySelector = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState(
    localStorage.getItem("selectedCategory") || "heroes"
  );

  const handleSelect = (category) => {
    setSelectedCategory(category);
    localStorage.setItem("selectedCategory", category);
  };

  const navigate = useNavigate();
  const containerRef = useRef(null); // Ref for animation

  useEffect(() => {
    gsap.from(containerRef.current, {
      x: "100vw",        // Start off-screen to the right
      opacity: 0,        // Fade in
      duration: 0.6,     // Animation duration
      ease: "power3.out" // Easing function for smooth animation
    });
  }, []);

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
    <Layout title={t("SelectCategory")} onBackClick={() => navigate("/")}>
      <div ref={containerRef} className="categoryContainer">
        <img src={getLogoByCategory(selectedCategory)} alt="Logo" />
        <button
          className="tabButtonCategory"
          onClick={() => handleSelect("heroes")}
        >
         {t("heroes")}
        </button>
        <button
          className="tabButtonCategory"
          onClick={() => handleSelect("movies")}
        >
          {t("movies")}
        </button>
        <button
          className="tabButtonCategory"
          onClick={() => handleSelect("musicians")}
        >
          {t("musicians")}
        </button>
        <button
          className="tabButtonCategory"
          onClick={() => handleSelect("videogames")}
        >
          {t("videogames")}
        </button>
      </div>
    </Layout>
  );
};

export default CategorySelector;
