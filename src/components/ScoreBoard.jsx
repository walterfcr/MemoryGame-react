import React, { useState, useEffect, useRef } from "react";
import Layout from "./Layout";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";
import "./ScoreBoard.css";

const ScoreBoard = () => {
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
    gsap.from(containerRef.current, { x: "100vw", opacity: 0, duration: 0.6, ease: "power3.out" });

    const fetchScores = async () => {
      try {
        const q = query(collection(db, "scores"), orderBy("score", "desc"), limit(10));
        const snapshot = await getDocs(q);
        const fetchedScores = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setScores(fetchedScores);
      } catch (err) {
        console.error("Error loading scores:", err);
        const localScores = JSON.parse(localStorage.getItem("memoryGameScores") || "[]");
        setScores(localScores);
      }
    };

    fetchScores();
  }, []);

  return (
    <Layout title={t("score")} onBackClick={playSoundAndGoBack}>
      <div ref={containerRef} className="scoreboardContent">
        {scores.length === 0 ? (
          <p>{t("noScoresYet")}</p>
        ) : (
          <>
            <div className="top-score">
              🏆 {t("topScore")}: {scores[0].playerName} - {scores[0].score}
            </div>
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
                  <tr key={idx} className={idx === 0 ? "highlight-top-score" : ""}>
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
          </>
        )}
      </div>
    </Layout>
  );
};

export default ScoreBoard;
