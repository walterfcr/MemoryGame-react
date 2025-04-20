import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import './StartPage.css';

const StartPage = () => {
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
    <h2>Memory Gamne</h2>
  </div>
    <div className="startPageContainer" ref={containerRef}>
      <img src="/images/logo.png" alt="Logo" className="logoImage" />

      <div className="tabsContainer">
        <button onClick={() => handleNavigate("/login")} className="tabButton">Login</button>
        <button onClick={() => handleNavigate("/difficulty")} className="tabButton">Difficulty</button>
        <button onClick={() => handleNavigate("/categories")} className="tabButton">Categories</button>
        <button onClick={() => handleNavigate("/score")} className="tabButton">Score</button>
        <button onClick={() => handleNavigate("/language")} className="tabButton">Language</button>
        <button onClick={() => handleNavigate("/credits")} className="tabButton">Credits</button>
      </div>

      <button onClick={() => handleNavigate("/play")} className="playButton">Play</button>
    </div>
    </main>
  );
};

export default StartPage;
