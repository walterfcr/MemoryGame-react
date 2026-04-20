"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useAuth } from "../context/AuthContext"
import Layout from "./Layout"
import "./Profile.css"

function Profile() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()

  const [userStats, setUserStats] = useState(null)
  const [recentScores, setRecentScores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const clickSound = useRef(new Audio("/sounds/click.wav"))

  const playClickSound = () => {
    if (clickSound.current) {
      clickSound.current.currentTime = 0
      clickSound.current.play()
    }
  }

  const handleBack = () => {
    playClickSound()
    navigate("/")
  }

  const handleLogout = () => {
    playClickSound()
    logout()
  }

  const handleViewAllScores = () => {
    playClickSound()
    navigate("/Leaderboard")
  }

  // ✅ LOAD USER DATA FROM FIREBASE
  useEffect(() => {
    const loadUserData = async () => {
      if (!isAuthenticated || !user || !user.uid) {
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const { collection, query, where, getDocs, orderBy, limit } = await import("firebase/firestore")
        const { db } = await import("../firebase")

        const q = query(
          collection(db, "scores"),
          where("uid", "==", user.uid),
          orderBy("date", "desc"),
          limit(10)
        )

        const snapshot = await getDocs(q)

        const scores = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        setRecentScores(scores)

        // ✅ CALCULATE STATS (FIXED clicks instead of moves)
        if (scores.length > 0) {
          const totalGames = scores.length
          const bestTime = Math.min(...scores.map((s) => s.time))
          const averageTime = scores.reduce((sum, s) => sum + s.time, 0) / totalGames
          const totalMoves = scores.reduce((sum, s) => sum + (s.clicks || 0), 0)
          const averageMoves = totalMoves / totalGames

          const categoryCount = scores.reduce((acc, score) => {
            acc[score.category] = (acc[score.category] || 0) + 1
            return acc
          }, {})

          const favoriteCategory = Object.keys(categoryCount).reduce((a, b) =>
            categoryCount[a] > categoryCount[b] ? a : b
          )

          const difficultyCount = scores.reduce((acc, score) => {
            acc[score.difficulty] = (acc[score.difficulty] || 0) + 1
            return acc
          }, {})

          const favoriteDifficulty = Object.keys(difficultyCount).reduce((a, b) =>
            difficultyCount[a] > difficultyCount[b] ? a : b
          )

          setUserStats({
            totalGames,
            bestTime,
            averageTime: Math.round(averageTime),
            totalMoves,
            averageMoves: Math.round(averageMoves),
            favoriteCategory,
            favoriteDifficulty,
          })
        } else {
          setUserStats({
            totalGames: 0,
            bestTime: 0,
            averageTime: 0,
            totalMoves: 0,
            averageMoves: 0,
            favoriteCategory: "N/A",
            favoriteDifficulty: "N/A",
          })
        }
      } catch (err) {
        console.error("❌ Error loading user data:", err)
        setError(err.message || "Failed to load user data")
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [isAuthenticated, user])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getCategoryEmoji = (category) => {
    const emojis = {
      heroes: "🦸",
      movies: "🎬",
      musicians: "🎵",
      videogames: "🎮",
    }
    return emojis[category] || "🎯"
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <Layout title={t("profile")} onBackClick={handleBack}>
      <div className="profile-container">

        {loading && (
          <div className="status-message">
            <div className="status-icon">🔄</div>
            <p>{t("loadingProfile")}</p>
          </div>
        )}

        {error && (
          <div className="status-message error-message">
            <div className="status-icon">❌</div>
            <p>Error: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* USER INFO */}
            <div className="profile-card">
              <div className="profile-avatar">
                <div className="avatar-circle">
                  {(user?.displayName || user?.email || "U").charAt(0).toUpperCase()}
                </div>
              </div>

              <div className="profile-info">
                <h2 className="profile-username">{user?.displayName || user?.email?.split("@")[0] || "User"}</h2>
                <p className="profile-email">{user?.email || "-"}</p>
                <p className="profile-join-date">
                  {t("memberSince")}: {user?.joinDate ? new Date(user.joinDate).toLocaleDateString() : "-"}
                </p>
              </div>
            </div>

            {/* STATS */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🎮</div>
                <div className="stat-value">{userStats?.totalGames || 0}</div>
                <div className="stat-label">{t("gamesPlayed")}</div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⚡</div>
                <div className="stat-value">
                  {userStats?.bestTime ? formatTime(userStats.bestTime) : "--"}
                </div>
                <div className="stat-label">{t("bestTime")}</div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-value">
                  {userStats?.averageTime ? formatTime(userStats.averageTime) : "--"}
                </div>
                <div className="stat-label">{t("averageTime")}</div>
              </div>
            </div>

            {/* RECENT SCORES */}
            <div className="recent-scores-section">
              <h3 className="section-title">{t("recentScores")}</h3>

              {recentScores.length === 0 ? (
                <div className="no-scores-message">
                  <p>{t("noGamesYet")}</p>
                  <button onClick={() => navigate("/play")} className="primary-button">
                    {t("playFirstGame")}
                  </button>
                </div>
              ) : (
                <div className="scores-list">
                  {recentScores.slice(0, 5).map((score, index) => (
                    <div key={score.id} className="score-item">
                      <div className="score-rank">#{index + 1}</div>

                      <div className="score-details">
                        <div className="score-category">
                          {getCategoryEmoji(score.category)} {score.category}
                        </div>

                        <div className="score-meta">
                          {score.difficulty} • {formatTime(score.time)} • {score.clicks} {t("moves")}
                        </div>
                      </div>

                      <div className="score-date">{score.date}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ACTIONS */}
            <div className="profile-actions">
              <button onClick={handleViewAllScores} className="primary-button">
                📊 {t("viewAllScores")}
              </button>

              <button onClick={() => navigate("/play")} className="primary-button">
                🎮 {t("playGame")}
              </button>

              <button onClick={handleLogout} className="secondary-button">
                🚪 {t("logout")}
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}

export default Profile