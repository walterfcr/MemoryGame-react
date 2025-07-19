"use client"

// Updated EnhancedMemoryGame that uses your real component
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import PlayerNameInput from "./PlayerNameInput"
import GameComplete from "./GameComplete"
import MemoryGameBackend from "./MemoryGameBackend"

function EnhancedMemoryGameUpdated({ category, difficulty }) {
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

  const handleMoveCount = (currentMoves) => {
    setTotalMoves(currentMoves)
  }

  const handlePlayAgain = () => {
    setGameState("playing") // Go directly to playing, keep same name
    setGameStartTime(Date.now())
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
        difficulty={difficulty.toLowerCase()} // Convert to lowercase for backend
        gameTime={gameTime}
        totalMoves={totalMoves}
        onPlayAgain={handlePlayAgain}
        onBackToMenu={handleBackToMenu}
      />
    )
  }

  // Playing state - show your actual MemoryGame
  return (
    <MemoryGameBackend
      category={category}
      difficulty={difficulty} // Keep original case for your component
      playerName={playerName}
      onGameComplete={handleGameComplete}
      onMoveCount={handleMoveCount}
    />
  )
}

export default EnhancedMemoryGameUpdated
