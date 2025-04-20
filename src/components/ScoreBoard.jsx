import React from 'react';
import { useNavigate } from "react-router-dom";


export function ScoreBoard() {
  const navigate = useNavigate();
  return (
    <div className="titleHeader">
       <h2>Score Board</h2>
       <button className="backButton" onClick={() => navigate("/")}>
          ⬅ Back
        </button>
    </div>
  );
}

export default ScoreBoard;