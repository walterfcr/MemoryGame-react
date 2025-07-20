"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"

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
  const [scores, setScores] = useState<Score[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")

  const categories = ["all", "heroes", "movies", "musicians", "videogames"]
  const difficulties = ["all", "easy", "medium", "hard"]

  // Load scores from backend
  const loadScores = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/scores`);
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
      easy: "#28a745",
      medium: "#ffc107",
      hard: "#dc3545",
    }
    return colors[difficulty] || "#6c757d"
  }

  const getRankEmoji = (index: number) => {
    if (index === 0) return "🥇"
    if (index === 1) return "🥈"
    if (index === 2) return "🥉"
    return `#${index + 1}`
  }

  if (loading) {
    return (
      <div className="leaderboard-container" style={{ padding: "20px", textAlign: "center" }}>
        <h2>🏆 {t("leaderboard") || "Leaderboard"}</h2>
        <div style={{ padding: "40px" }}>
          <div style={{ fontSize: "24px", marginBottom: "10px" }}>🔄</div>
          <p>Loading scores...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="leaderboard-container" style={{ padding: "20px", textAlign: "center" }}>
        <h2>🏆 {t("leaderboard") || "Leaderboard"}</h2>
        <div style={{ padding: "40px", color: "#dc3545" }}>
          <div style={{ fontSize: "24px", marginBottom: "10px" }}>❌</div>
          <p>Error loading scores: {error}</p>
          <button
            onClick={loadScores}
            style={{
              marginTop: "15px",
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="leaderboard-container" style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>🏆 {t("leaderboard") || "Leaderboard"}</h2>

      {/* Filters */}
      <div
        className="filters"
        style={{
          display: "flex",
          gap: "20px",
          justifyContent: "center",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <label htmlFor="category-filter" style={{ marginRight: "10px", fontWeight: "bold" }}>
            Category:
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: "8px 12px",
              fontSize: "14px",
              borderRadius: "5px",
              border: "2px solid #ddd",
            }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all" ? "All Categories" : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="difficulty-filter" style={{ marginRight: "10px", fontWeight: "bold" }}>
            Difficulty:
          </label>
          <select
            id="difficulty-filter"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            style={{
              padding: "8px 12px",
              fontSize: "14px",
              borderRadius: "5px",
              border: "2px solid #ddd",
            }}
          >
            {difficulties.map((diff) => (
              <option key={diff} value={diff}>
                {diff === "all" ? "All Difficulties" : diff.charAt(0).toUpperCase() + diff.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={loadScores}
          style={{
            padding: "8px 16px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Stats Summary */}
      <div
        className="stats-summary"
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ textAlign: "center", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#007bff" }}>{sortedScores.length}</div>
          <div style={{ fontSize: "14px", color: "#666" }}>Total Scores</div>
        </div>
        <div style={{ textAlign: "center", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#28a745" }}>
            {sortedScores.length > 0 ? formatTime(sortedScores[0].time) : "--"}
          </div>
          <div style={{ fontSize: "14px", color: "#666" }}>Best Time</div>
        </div>
        <div style={{ textAlign: "center", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#ffc107" }}>
            {[...new Set(sortedScores.map((s) => s.playerName))].length}
          </div>
          <div style={{ fontSize: "14px", color: "#666" }}>Players</div>
        </div>
      </div>

      {/* Scores Table */}
      {sortedScores.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>🎯</div>
          <h3>No scores found</h3>
          <p>
            {selectedCategory !== "all" || selectedDifficulty !== "all"
              ? "Try adjusting your filters or play some games!"
              : "Be the first to play and set a record!"}
          </p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "white",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Rank</th>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Player</th>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Category</th>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Difficulty</th>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Time</th>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Moves</th>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {sortedScores.map((score, index) => (
                <tr
                  key={score.id}
                  style={{
                    borderBottom: "1px solid #dee2e6",
                    backgroundColor: index < 3 ? "#fff9e6" : "white",
                  }}
                >
                  <td style={{ padding: "15px", fontSize: "18px", fontWeight: "bold" }}>{getRankEmoji(index)}</td>
                  <td style={{ padding: "15px", fontWeight: "bold", color: "#333" }}>{score.playerName}</td>
                  <td style={{ padding: "15px" }}>
                    <span style={{ marginRight: "8px" }}>{getCategoryEmoji(score.category)}</span>
                    {score.category.charAt(0).toUpperCase() + score.category.slice(1)}
                  </td>
                  <td style={{ padding: "15px" }}>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "20px",
                        color: "white",
                        fontSize: "12px",
                        fontWeight: "bold",
                        backgroundColor: getDifficultyColor(score.difficulty),
                      }}
                    >
                      {score.difficulty.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "15px", fontFamily: "monospace", fontSize: "16px", fontWeight: "bold" }}>
                    {formatTime(score.time)}
                  </td>
                  <td style={{ padding: "15px", textAlign: "center" }}>{score.moves}</td>
                  <td style={{ padding: "15px", color: "#666", fontSize: "14px" }}>{score.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: "30px", color: "#666", fontSize: "14px" }}>
        <p>🎮 Funko Memory Game Leaderboard • Auto-refreshes every 30 seconds</p>
      </div>
    </div>
  )
}

export default Leaderboard
