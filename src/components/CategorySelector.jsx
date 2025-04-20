import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from './Layout';
import { gsap } from 'gsap'; // Import GSAP for animation
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
    <Layout title="Select Category" onBackClick={() => navigate("/")}>
      <div ref={containerRef} className="categoryContainer">
        <img src={getLogoByCategory(selectedCategory)} alt="Logo" />
        <button
          className="tabButtonCategory"
          onClick={() => handleSelect("heroes")}
        >
          Heroes and Villians
        </button>
        <button
          className="tabButtonCategory"
          onClick={() => handleSelect("movies")}
        >
          Movies and series
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
    </Layout>
  );
};

export default CategorySelector;
