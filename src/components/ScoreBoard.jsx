import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import Layout from './Layout';
import { gsap } from 'gsap';
import { useTranslation } from 'react-i18next';
import './ScoreBoard.css';

export function ScoreBoard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [scores, setScores] = useState([]);

  const clickSound = useRef(new Audio("/sounds/click.wav"));

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

    const savedScores = JSON.parse(localStorage.getItem("memoryGameScores") || "[]");
    setScores(savedScores);
  }, []);

  return (
    <Layout title={t("score")} onBackClick={playSoundAndGoBack}>
      <div ref={containerRef} className="scoreboardContent">
        {scores.length === 0 ? (
          <p>No scores yet.</p>
        ) : (
          <table className="score-table">
            <thead>
              <tr>
                <th>{t("yourName")}</th>
                <th className="hide-on-mobile">{t("difficulty")}</th>
                <th className="hide-on-mobile">{t("category")}</th>
                <th>{t("time")}</th>
                <th>{t("clicks")}</th>
                <th>{t("score")}</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((entry, idx) => (
                <tr key={idx}>
                  <td>{entry.playerName}</td>
                  <td className="hide-on-mobile">{t(entry.difficulty.toLowerCase())}</td>
                  <td className="hide-on-mobile">{t(entry.category)}</td>
                  <td>{entry.time}s</td>
                  <td>{entry.clicks}</td>
                  <td>{entry.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}

export default ScoreBoard;
