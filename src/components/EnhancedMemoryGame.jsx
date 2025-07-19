"use client"

// Enhanced version of your MemoryGame that integrates with backend
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import PlayerNameInput from "./PlayerNameInput"
import GameComplete from "./GameComplete"

function EnhancedMemoryGame({ category, difficulty }) {
  const [gameState, setGameState] = useState("name-input") // 'name-input', 'playing', 'complete'
  const [playerName, setPlayerName] = useState("")
  const [gameStartTime, setGameStartTime] = useState(null)
  const [gameEndTime, setGameEndTime] = useState(null)
  const [totalMoves, setTotalMoves] = useState(0)
  const navigate = useNavigate()

  const handleNameSubmit = (name) => {
    setPlayerName(name)
    setGameState("playing")
    setGameStartTime(Date.now())
    setTotalMoves(0)
  }

  const handleGameComplete = (moves) => {
    setGameEndTime(Date.now())
    setTotalMoves(moves)
    setGameState("complete")
  }

  const handlePlayAgain = () => {
    setGameState("name-input")
    setPlayerName("")
    setGameStartTime(null)
    setGameEndTime(null)
    setTotalMoves(0)
  }

  const handleBackToMenu = () => {
    navigate("/")
  }

  const gameTime = gameEndTime && gameStartTime ? (gameEndTime - gameStartTime) / 1000 : 0

  if (gameState === "name-input") {
    return <PlayerNameInput onNameSubmit={handleNameSubmit} currentCategory={category} currentDifficulty={difficulty} />
  }

  if (gameState === "complete") {
    return (
      <GameComplete
        playerName={playerName}
        category={category}
        difficulty={difficulty}
        gameTime={gameTime}
        totalMoves={totalMoves}
        onPlayAgain={handlePlayAgain}
        onBackToMenu={handleBackToMenu}
      />
    )
  }

  // This is where your existing MemoryGame component would go
  // For now, let's create a simple placeholder that simulates a game
  return (
    <div className="memory-game-container" style={{ textAlign: "center", padding: "20px" }}>
      <h2>
        🎮 Playing: {category} ({difficulty})
      </h2>
      <p>Player: {playerName}</p>
      <p>Moves: {totalMoves}</p>

      {/* This is a placeholder - replace with your actual game logic */}
      <div style={{ margin: "30px 0" }}>
        <p>🚧 This is where your actual MemoryGame component would go</p>
        <p>For testing, click the button below to simulate completing the game:</p>
        <button
          onClick={() => handleGameComplete(Math.floor(Math.random() * 20) + 10)}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          🎯 Simulate Game Complete (for testing)
        </button>
      </div>
    </div>
  )
}

export default EnhancedMemoryGame

