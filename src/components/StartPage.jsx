import React from "react";
import { Link } from "react-router-dom"; // Import Link to handle navigation
import './StartPage.css'; // We'll create this for scoped styling

const StartPage = () => {
  return (
    <div className="startPageContainer">
    
      <img src="/images/logo.png" alt="Logo" className="logoImage" />
      <div className="tabsContainer">
        <Link to="/login" className="tabButton">Login</Link>
        <Link to="/difficulty" className="tabButton">Difficulty</Link>
        <Link to="/categories" className="tabButton">Categories</Link>
        <Link to="/score" className="tabButton">Score</Link>
        <Link to="/language" className="tabButton">Language</Link>
        <Link to="/credits" className="tabButton">Credits</Link>
      </div>

      <Link to="/play" className="playButton">Play</Link>
    </div>
  );
};

export default StartPage;
