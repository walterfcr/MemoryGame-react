import React, { useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import Layout from './Layout';
import { gsap } from 'gsap';
import { useTranslation } from 'react-i18next';

export function ScoreBoard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // Sound setup
  const clickSound = useRef(new Audio("/sounds/click.mp3"));

  const playSoundAndGoBack = () => {
    clickSound.current.currentTime = 0;
    clickSound.current.play();
    navigate("/");
  };

  useEffect(() => {
    gsap.from(containerRef.current, {
      x: "100vw",
      opacity: 0,
      duration: 0.6,
      ease: "power3.out"
    });
  }, []);

  return (
    <Layout title={t("score")} onBackClick={playSoundAndGoBack}>
      <div ref={containerRef} className="scoreboardContent">
        {/* Replace with actual scoreboard display */}
        <p>High scores will be shown here.</p>
      </div>
    </Layout>
  );
}

export default ScoreBoard;
