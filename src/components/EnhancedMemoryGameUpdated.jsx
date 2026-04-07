"use client"

import { useState, useEffect } from "react"
import MemoryGame from "./MemoryGame"
import { useAuth } from "../context/AuthContext"
import PlayerNameEntry from "./PlayerNameEntry"

function EnhancedMemoryGameUpdated({ category: initialCategory, difficulty: initialDifficulty }) {
  const [gameState, setGameState] = useState("name-input")
  const [playerName, setPlayerName] = useState("")

  const { user, isAuthenticated } = useAuth()

  const [currentCategory, setCurrentCategory] = useState(
    initialCategory || localStorage.getItem("selectedCategory") || "musicians"
  )

  const [currentDifficulty, setCurrentDifficulty] = useState(
    initialDifficulty || localStorage.getItem("selectedDifficulty") || "Easy"
  )

  // Sync props with state
  useEffect(() => {
    setCurrentCategory(initialCategory || localStorage.getItem("selectedCategory") || "musicians")
    setCurrentDifficulty(initialDifficulty || localStorage.getItem("selectedDifficulty") || "Easy")
  }, [initialCategory, initialDifficulty])

  // Handle player (auth or localStorage)
  useEffect(() => {
    if (isAuthenticated && user?.username) {
      setPlayerName(user.username)
      localStorage.setItem("playerName", user.username)
      setGameState("playing")
    } else {
      const storedPlayerName = localStorage.getItem("playerName")

      if (storedPlayerName) {
        setPlayerName(storedPlayerName)
        setGameState("playing")
      } else {
        setGameState("name-input")
      }
    }
  }, [isAuthenticated, user])

  const handleNameSubmit = (name) => {
    setPlayerName(name)
    localStorage.setItem("playerName", name)
    setGameState("playing")
  }

  // Step 1: ask for name
  if (gameState === "name-input") {
    return <PlayerNameEntry onNameSubmit={handleNameSubmit} />
  }

  // Step 2: play game
  return (
    <MemoryGame
      category={currentCategory}
      difficulty={currentDifficulty}
      playerName={playerName}
    />
  )
}

export default EnhancedMemoryGameUpdated