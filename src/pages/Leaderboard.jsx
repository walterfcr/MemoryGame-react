"use client"

import { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import Layout from "../components/Layout"
import "./Leaderboard.css"
import { useAuth } from "../context/AuthContext"
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore" 
import { db } from "../firebase"

const Leaderboard = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()

  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [activeTab, setActiveTab] = useState("All")

  const clickSound = useRef(new Audio("/sounds/click.wav"))

  const playClickSound = () => {
    clickSound.current.currentTime = 0
    clickSound.current.play()
  }

  const handleBack = () => {
    playClickSound()
    navigate("/menu")
  }

  // fetch top scores globally or filtered by difficulty
  const loadScores = async (difficultyFilter) => {
    setLoading(true)
    try {
      let q;
      
      // apply firestore filters only when a specific difficulty is selected
      if (difficultyFilter === "All") {
        q = query(
          collection(db, "scores"),
          orderBy("score", "desc"),
          limit(12)
        )
      } else {
        q = query(
          collection(db, "scores"),
          where("difficulty", "==", difficultyFilter),
          orderBy("score", "desc"),
          limit(12)
        )
      }

      const snapshot = await getDocs(q)
      const scoresData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      setScores(scoresData)
    } catch (error) {
      console.error("❌ Error loading scores:", error)
    } finally {
      setLoading(false)
    }
  }

  // reload leaderboard whenever the selected tab changes
  useEffect(() => {
    loadScores(activeTab)
  }, [activeTab])

  const handleTabChange = (tabName) => {
    playClickSound()
    setActiveTab(tabName)
  }

  // format seconds into mm:ss display format
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // assign medal emojis to top 3 players
  const getRankEmoji = (index) => {
    if (index === 0) return "🥇"
    if (index === 1) return "🥈"
    if (index === 2) return "🥉"
    return `#${index + 1}`
  }

  const currentUsername = user?.displayName || user?.email?.split("@")[0]

  return (
    <Layout title={t("leaderboard")} onBackClick={handleBack}>
      <div className="leaderboard-container">
        
        <div className="leaderboard-tabs">
          <button 
            className={`tab-btn ${activeTab === "All" ? "active" : ""}`}
            onClick={() => handleTabChange("All")}
          >
            {t("all") || "All"}
          </button>
          <button 
            className={`tab-btn ${activeTab === "Easy" ? "active" : ""}`}
            onClick={() => handleTabChange("Easy")}
          >
            {t("easy")}
          </button>
          <button 
            className={`tab-btn ${activeTab === "Medium" ? "active" : ""}`}
            onClick={() => handleTabChange("Medium")}
          >
            {t("medium")}
          </button>
          <button 
            className={`tab-btn ${activeTab === "Hard" ? "active" : ""}`}
            onClick={() => handleTabChange("Hard")}
          >
            {t("hard")}
          </button>
        </div>

        {loading ? (
          <p className="loading-text">🔄 {t("loadingScores") || "Loading scores..."}</p>
        ) : scores.length === 0 ? (
          <p className="no-scores-text">🎯 {t("noScoresFound")}</p>
        ) : (
      
          <div className="leaderboard-list">
  {scores.map((score, index) => (
    <div
      key={score.id}

      // highlight the current authenticated player's score
      className={`leaderboard-card ${
        isAuthenticated && currentUsername === score.playerName
          ? "highlight-row"
          : ""
      }`}
    >
      <div className="leaderboard-card-top">

        <div className="leaderboard-rank">
          {getRankEmoji(index)}
        </div>

        <div className="leaderboard-player-info">
          <h3>
            {score.playerName}

            {isAuthenticated &&
              currentUsername === score.playerName &&
              ` (${t("you") || "You"})`}
          </h3>

          <p>
            {t(score.category) || score.category}
            {" • "}
            {t(score.difficulty.toLowerCase()) || score.difficulty}
          </p>
        </div>

        <div className="leaderboard-score">
          🏆 {score.score}
        </div>
      </div>

      <div className="leaderboard-card-stats">
        <span>⏱ {formatTime(score.time)}</span>
        <span>🖱 {score.clicks}</span>
      </div>
    </div>
      ))}
    </div>
        
        )}
      </div>
    </Layout>
  )
}

export default Leaderboard