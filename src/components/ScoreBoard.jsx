import React, { useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import Layout from './Layout';
import { gsap } from 'gsap';

export function ScoreBoard() {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.from(containerRef.current, {
      x: "100vw",
      opacity: 0,
      duration: 0.6,
      ease: "power3.out"
    });
  }, []);

  return (
    <Layout title="Score Board" onBackClick={() => navigate("/")}>
      <div ref={containerRef} className="scoreboardContent">
        {/* Replace with actual scoreboard display */}
        <p>High scores will be shown here.</p>
      </div>
    </Layout>
  );
}

export default ScoreBoard;
