"use client"

import { useState, useEffect } from "react"

function GameComplete({ playerName, category, difficulty, gameTime, totalMoves, onPlayAgain, onBackToMenu }) {
  const [saveStatus, setSaveStatus] = useState("saving") // 'saving', 'success', 'error'
  const [saveMessage, setSaveMessage] = useState("")

  // Define API base URL from environment variable or fallback to localhost
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3002/api"

  useEffect(() => {
    // Automatically save the score when component mounts
    const saveScore = async () => {
      try {
        const scoreData = {
          playerName,
          category,
          difficulty,
          time: Math.round(gameTime),
          moves: totalMoves,
        }

        console.log("Saving score:", scoreData)
        const response = await fetch(`${API_BASE_URL}/scores`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(scoreData),
        })

        const result = await response.json()

        if (response.status === 409) {
          // Duplicate detected - show success to user but log the duplicate
          console.log("🚫 Duplicate prevented by server (hidden from user)")
          setSaveStatus("success")
          setSaveMessage("Score saved successfully!")
        } else if (!response.ok) {
          throw new Error(result.error || "Failed to save score")
        } else {
          setSaveStatus("success")
          setSaveMessage(result.message || "Score saved successfully!")
        }
      } catch (error) {
        setSaveStatus("error")
        setSaveMessage(error.message || "Failed to save score")
        console.error("Failed to save score:", error)
      }
    }

    saveScore()
  }, [playerName, category, difficulty, gameTime, totalMoves, API_BASE_URL])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="game-complete-container" style={{ textAlign: "center", padding: "30px" }}>
      <h1>🎉 Congratulations!</h1>
      <h2>Game Complete!</h2>

      <div
        className="score-summary"
        style={{
          backgroundColor: "#f8f9fa",
          padding: "20px",
          borderRadius: "10px",
          margin: "20px 0",
          display: "inline-block",
        }}
      >
        <h3>📊 Your Score</h3>
        <p>
          <strong>Player:</strong> {playerName}
        </p>
        <p>
          <strong>Category:</strong> {category}
        </p>
        <p>
          <strong>Difficulty:</strong> {difficulty}
        </p>
        <p>
          <strong>Time:</strong> {formatTime(gameTime)}
        </p>
        <p>
          <strong>Moves:</strong> {totalMoves}
        </p>
      </div>

      {/* Save Status */}
      <div className="save-status" style={{ margin: "20px 0" }}>
        {saveStatus === "saving" && <p style={{ color: "#007bff" }}>💾 Saving your score to leaderboard...</p>}
        {saveStatus === "success" && <p style={{ color: "#28a745" }}>✅ {saveMessage}</p>}
        {saveStatus === "error" && <p style={{ color: "#dc3545" }}>❌ {saveMessage}</p>}
      </div>

      {/* Action Buttons */}
      <div className="action-buttons" style={{ marginTop: "30px" }}>
        <button
          onClick={onPlayAgain}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginRight: "15px",
          }}
        >
          🔄 Play Again
        </button>

        <button
          onClick={onBackToMenu}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          🏠 Back to Menu
        </button>
      </div>
    </div>
  )
}

export default GameComplete
