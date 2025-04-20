import React from 'react';
import { useNavigate } from "react-router-dom";


export function Credits() {
  const navigate = useNavigate();
  return (
    <div className="titleHeader">
       <h2>Credits</h2>
       <button className="backButton" onClick={() => navigate("/")}>
          ⬅ Back
        </button>
    </div>
  );
}

export default Credits;