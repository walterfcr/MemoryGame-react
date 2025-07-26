"use client"

import { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import Layout from "./Layout"
import "./Leaderboard.css"
import { getScores, getMyScores } from "../api/gameApi"
import { useAuth } from "../context/AuthContext" // RUTA CORREGIDA: de src/context a context

interface Score {
  id: number
  playerName: string
  category: string
  difficulty: string
  time: number
  moves: number
  date: string
}

const Leaderboard = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isAuthenticated, user, token } = useAuth()
  const [scores, setScores] = useState<Score[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [showMyScores, setShowMyScores] = useState(false)

  const categories = ["all", "heroes", "movies", "musicians", "videogames"]
  const difficulties = ["all", "easy", "medium", "hard"]

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

  const loadScores = async () => {
    setLoading(true)
    setError(null)
    try {
      let scoresData
      const limit = 15

      if (showMyScores && isAuthenticated && token) {
        scoresData = await getMyScores(token, limit, selectedCategory, selectedDifficulty)
      } else {
        scoresData = await getScores(limit, selectedCategory, selectedDifficulty)
      }

      setScores(scoresData || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load scores")
      console.error("Error loading scores:", err)
    } finally {
      setLoading(false)
    }
  }

  const sortedScores = scores.sort((a, b) => a.time - b.time || a.moves - b.moves)

  useEffect(() => {
    loadScores()
  }, [selectedCategory, selectedDifficulty, showMyScores, isAuthenticated, token])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getCategoryEmoji = (category: string) => {
    const emojis: Record<string, string> = {
      heroes: "🦸",
      movies: "🎬",
      musicians: "🎵",
      videogames: "🎮",
    }
    return emojis[category] || "🎯"
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      easy: "#28a745",
      medium: "#46219cff",
      hard: "#1b156eff",
    }
    return colors[difficulty] || "#6c757d"
  }

  const getRankEmoji = (index: number) => {
    if (index === 0) return "🥇"
    if (index === 1) return "🥈"
    if (index === 2) return "🥉"
    return `#${index + 1}`
  }

  return (
    <Layout title={t("leaderboard") || "Leaderboard"} onBackClick={handleBack}>
      <div className="leaderboard-container">
        {loading && (
          <div className="status-message">
            <div className="status-icon">🔄</div>
            <p>Loading scores...</p>
          </div>
        )}

        {error && (
          <div className="status-message error-message">
            <div className="status-icon">❌</div>
            <p>Error loading scores: {error}</p>
            <button onClick={loadScores} className="primary-button">
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="filters">
              <div>
                <label htmlFor="category-filter" className="filter-label">
                  {t("category")}:
                </label>
                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="filter-select"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "all" ? t("allCategories") : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="difficulty-filter" className="filter-label">
                  {t("difficulty")}:
                </label>
                <select
                  id="difficulty-filter"
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="filter-select"
                >
                  {difficulties.map((diff) => (
                    <option key={diff} value={diff}>
                      {diff === "all" ? t("allDifficulties") : diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {isAuthenticated && (
                <button
                  onClick={() => {
                    playClickSound()
                    setShowMyScores(!showMyScores)
                  }}
                  className="primary-button"
                  style={{ backgroundColor: showMyScores ? "#007bff" : "var(--secondary-color)" }}
                >
                  {showMyScores ? `👤 ${t("allScores")}` : `⭐ ${t("myScores")}`}
                </button>
              )}

              <button onClick={loadScores} className="primary-button">
                🔄 {t("refresh")}
              </button>
            </div>

            <div className="stats-summary">
              <div className="stat-card">
                <div className="stat-value">{sortedScores.length}</div>
                <div className="stat-label">{t("totalScores")}</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{sortedScores.length > 0 ? formatTime(sortedScores[0].time) : "--"}</div>
                <div className="stat-label">{t("bestTime")}</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{[...new Set(sortedScores.map((s) => s.playerName))].length}</div>
                <div className="stat-label">{t("players")}</div>
              </div>
            </div>

            {sortedScores.length === 0 ? (
              <div className="no-scores-message">
                <div className="no-scores-icon">🎯</div>
                <h3>{t("noScoresFound")}</h3>
                <p>
                  {showMyScores && !isAuthenticated
                    ? t("loginToSeeScores")
                    : selectedCategory !== "all" || selectedDifficulty !== "all"
                      ? t("adjustFiltersOrPlay")
                      : t("beTheFirstToPlay")}
                </p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="leaderboard-table">
                  <thead>
                    <tr>
                      <th>{t("rank")}</th>
                      <th>{t("player")}</th>
                      <th>{t("category")}</th>
                      <th>{t("difficulty")}</th>
                      <th>{t("time")}</th>
                      <th>{t("clicks")}</th>
                      <th>{t("date")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedScores.map((score, index) => (
                      <tr key={score.id}>
                        <td className="rank-cell">{getRankEmoji(index)}</td>
                        <td className="player-name-cell">
                          {score.playerName}
                          {isAuthenticated && user?.username === score.playerName && (
                            <span style={{ marginLeft: "5px", color: "#17f5d7" }}> ({t("you")})</span>
                          )}
                        </td>
                        <td>
                          <span className="category-emoji">{getCategoryEmoji(score.category)}</span>
                          {score.category.charAt(0).toUpperCase() + score.category.slice(1)}
                        </td>
                        <td>
                          <span
                            className="difficulty-badge"
                            style={{ backgroundColor: getDifficultyColor(score.difficulty) }}
                          >
                            {score.difficulty.toUpperCase()}
                          </span>
                        </td>
                        <td className="time-cell">{formatTime(score.time)}</td>
                        <td className="moves-cell">{score.moves}</td>
                        <td className="date-cell">{score.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="leaderboard-footer">
              <p>🎮 Funko Memory Game Leaderboard</p>
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}

export default Leaderboard
