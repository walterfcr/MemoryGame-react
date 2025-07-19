"use client"

// Component to get player name before starting the game
import { useState } from "react"

function PlayerNameInput({ onNameSubmit, currentCategory, currentDifficulty }) {
  const [playerName, setPlayerName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (playerName.trim()) {
      setIsSubmitting(true)
      onNameSubmit(playerName.trim())
    }
  }

  return (
    <div className="player-name-container" style={{ textAlign: "center", padding: "20px" }}>
      <h2>🎮 Ready to Play!</h2>
      <p>
        <strong>Category:</strong> {currentCategory} | <strong>Difficulty:</strong> {currentDifficulty}
      </p>

      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        <div>
          <label htmlFor="playerName" style={{ display: "block", marginBottom: "10px", fontSize: "18px" }}>
            Enter your name:
          </label>
          <input
            type="text"
            id="playerName"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Your name here..."
            maxLength={20}
            style={{
              padding: "10px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "2px solid #ccc",
              marginRight: "10px",
              minWidth: "200px",
            }}
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          disabled={!playerName.trim() || isSubmitting}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: !playerName.trim() || isSubmitting ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: !playerName.trim() || isSubmitting ? "not-allowed" : "pointer",
            marginTop: "15px",
          }}
        >
          {isSubmitting ? "Starting Game..." : "Start Game!"}
        </button>
      </form>

      <p style={{ marginTop: "15px", color: "#666", fontSize: "14px" }}>Your score will be saved to the leaderboard!</p>
    </div>
  )
}

export default PlayerNameInput
