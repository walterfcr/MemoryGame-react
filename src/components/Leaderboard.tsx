"use client"

import { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom" // Assuming you have react-router-dom for navigation
import Layout from "./Layout" // Import the Layout component
import "./Leaderboard.css" // Import the CSS file

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
  const [scores, setScores] = useState<Score[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")

  const categories = ["all", "heroes", "movies", "musicians", "videogames"]
  const difficulties = ["all", "easy", "medium", "hard"]

  const clickSound = useRef(new Audio("/sounds/click.wav")) // Assuming you have this sound

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

  // Load scores from backend
  const loadScores = async () => {
    setLoading(true)
    setError(null)
    try {
      // Ensure VITE_API_BASE_URL is correctly set in .env.local for local development
      // For Render deployment, this should be your Render API URL
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://funko-memory-game-api.onrender.com/api"
      const response = await fetch(`${apiBaseUrl}/scores`)
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch scores")
      }
      setScores(result.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load scores")
      console.error("Error loading scores:", err)
    } finally {
      setLoading(false)
    }
  }

  // Filter scores based on selected category and difficulty
  const filteredScores = scores.filter((score) => {
    const categoryMatch = selectedCategory === "all" || score.category === selectedCategory
    const difficultyMatch = selectedDifficulty === "all" || score.difficulty === selectedDifficulty
    return categoryMatch && difficultyMatch
  })

  // Sort by time (fastest first), then by moves (fewer first)
  const sortedScores = filteredScores.sort((a, b) => a.time - b.time || a.moves - b.moves)

  useEffect(() => {
    loadScores()
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadScores, 30000)
    return () => clearInterval(interval)
  }, [])

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
      easy: "#28a745", // Green
      medium: "#46219cff", // Yellow
      hard: "#1b156eff", // Red
    }
    return colors[difficulty] || "#6c757d" // Grey
  }

  const getRankEmoji = (index: number) => {
    if (index === 0) return "🥇"
    if (index === 1) return "🥈"
    if (index === 2) return "🥉"
    return `#${index + 1}`
  }


  return (
    <Layout title={t("score") || "Score"} onBackClick={handleBack}>
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
            {/* Filters */}
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
                      {cat === "all" ? "All Categories" : cat.charAt(0).toUpperCase() + cat.slice(1)}
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
                      {diff === "all" ? "All Difficulties" : diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <button onClick={loadScores} className="primary-button">
                🔄 {t("refresh")}
              </button>
            </div>

            {/* Stats Summary */}
            <div className="stats-summary">
              <div className="stat-card">
                <div className="stat-value">{sortedScores.length}</div>
                <div className="stat-label">{t("total")}</div>
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

            {/* Scores Table */}
            {sortedScores.length === 0 ? (
              <div className="no-scores-message">
                <div className="no-scores-icon">🎯</div>
                <h3>No scores found</h3>
                <p>
                  {selectedCategory !== "all" || selectedDifficulty !== "all"
                    ? "Try adjusting your filters or play some games!"
                    : "Be the first to play and set a record!"}
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
                        <td className="player-name-cell">{score.playerName}</td>
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

            {/* Footer */}
            <div className="leaderboard-footer">
              <p>🎮 Funko Memory Game Leaderboard • Auto-refreshes every 30 seconds</p>
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}

export default Leaderboard
