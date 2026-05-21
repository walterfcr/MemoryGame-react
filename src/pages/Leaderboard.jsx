"use client"

import { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import Layout from "../components/Layout"
import "./Leaderboard.css"
import { useAuth } from "../context/AuthContext"
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore" // 🚨 Added 'where'
import { db } from "../firebase"

const Leaderboard = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()

  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)
  
  // 🚨 State to keep track of the selected filter tab
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

  // 🚨 Modified to take the filter parameter directly
  const loadScores = async (difficultyFilter) => {
    setLoading(true)
    try {
      let q;
      
      if (difficultyFilter === "All") {
        // Fetch top overall scores
        q = query(
          collection(db, "scores"),
          orderBy("score", "desc"),
          limit(10)
        )
      } else {
        // 🚨 Filter results by specific difficulty string matching your localStorage values
        q = query(
          collection(db, "scores"),
          where("difficulty", "==", difficultyFilter),
          orderBy("score", "desc"),
          limit(10)
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

  // 🚨 Reload high scores every single time the filter tab switches
  useEffect(() => {
    loadScores(activeTab)
  }, [activeTab])

  const handleTabChange = (tabName) => {
    playClickSound()
    setActiveTab(tabName)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getRankEmoji = (index) => {
    if (index === 0) return "🥇"
    if (index === 1) return "🥈"
    if (index === 2) return "🥉"
    return `#${index + 1}`
  }

  // Safely extract the profile indicator matching user context definitions
  const currentUsername = user?.displayName || user?.email?.split("@")[0]

  return (
    <Layout title={t("leaderboard")} onBackClick={handleBack}>
      <div className="leaderboard-container">
        
        {/* 🚨 FILTER TABS BAR CONTAINER */}
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
          <div className="leaderboard-table-wrapper">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>{t("rank")}</th>
                <th>{t("player")}</th>
                <th>{t("category")}</th>
                <th>{t("difficulty")}</th>
                <th>{t("time")}</th>
                <th>{t("clicks")}</th>
                <th>{t("score")}</th>
              </tr>
            </thead>

            <tbody>
              {scores.map((score, index) => (
                <tr key={score.id} className={isAuthenticated && currentUsername === score.playerName ? "highlight-row" : ""}>
                  <td>{getRankEmoji(index)}</td>

                  <td>
                    {score.playerName}
                    {isAuthenticated && currentUsername === score.playerName && ` (${t("you") || "You"})`}
                  </td>

                  <td>{t(score.category) || score.category}</td>
                  <td>{t(score.difficulty.toLowerCase()) || score.difficulty}</td>
                  <td>{formatTime(score.time)}</td>
                  <td>{score.clicks}</td>
                  <td>{score.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Leaderboard