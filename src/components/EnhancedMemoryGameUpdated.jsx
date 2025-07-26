"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import GameComplete from "./GameComplete"
import MemoryGameBackend from "./MemoryGameBackend"
import { useAuth } from "../context/AuthContext" // Corrected path
import PlayerNameEntry from "./PlayerNameEntry"

function EnhancedMemoryGameUpdated({ category: initialCategory, difficulty: initialDifficulty }) {
  const [gameState, setGameState] = useState("name-input")
  const [playerName, setPlayerName] = useState("")
  const [gameStartTime, setGameStartTime] = useState(null)
  const [gameEndTime, setGameEndTime] = useState(null)
  const [totalMoves, setTotalMoves] = useState(0)
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()

  const [currentCategory, setCurrentCategory] = useState(
    initialCategory || localStorage.getItem("selectedCategory") || "musicians",
  )
  const [currentDifficulty, setCurrentDifficulty] = useState(
    initialDifficulty || localStorage.getItem("selectedDifficulty") || "Easy",
  )

  useEffect(() => {
    setCurrentCategory(initialCategory || localStorage.getItem("selectedCategory") || "musicians")
    setCurrentDifficulty(initialDifficulty || localStorage.getItem("selectedDifficulty") || "Easy")
  }, [initialCategory, initialDifficulty])

  useEffect(() => {
    if (isAuthenticated && user?.username) {
      setPlayerName(user.username)
      setGameState("playing")
      setGameStartTime(Date.now())
      setTotalMoves(0)
    } else {
      const storedPlayerName = localStorage.getItem("playerName")
      if (storedPlayerName) {
        setPlayerName(storedPlayerName)
        setGameState("playing")
        setGameStartTime(Date.now())
        setTotalMoves(0)
      } else {
        setGameState("name-input")
      }
    }
  }, [isAuthenticated, user])

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
    setGameState("playing")
    setGameStartTime(Date.now())
    setGameEndTime(null)
    setTotalMoves(0)
  }

  const gameTime = gameEndTime && gameStartTime ? (gameEndTime - gameStartTime) / 1000 : 0

  if (gameState === "name-input") {
    return <PlayerNameEntry onNameSubmit={handleNameSubmit} />
  }

  if (gameState === "complete") {
    return (
      <GameComplete
        playerName={playerName}
        category={currentCategory}
        difficulty={currentDifficulty.toLowerCase()}
        gameTime={gameTime}
        totalMoves={totalMoves}
        onPlayAgain={handlePlayAgain}
      />
    )
  }

  return (
    <MemoryGameBackend
      category={currentCategory}
      difficulty={currentDifficulty}
      playerName={playerName}
      onGameComplete={handleGameComplete}
      onMoveCount={handleMoveCount}
    />
  )
}

export default EnhancedMemoryGameUpdated
