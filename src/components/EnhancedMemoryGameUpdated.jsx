"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import PlayerNameInput from "./PlayerNameInput"
import GameComplete from "./GameComplete"
import MemoryGameBackend from "./MemoryGameBackend"

// EnhancedMemoryGameUpdated ahora recibe props genéricas,
// y determina la categoría/dificultad internamente.
function EnhancedMemoryGameUpdated({ category: initialCategory, difficulty: initialDifficulty }) {
  const [gameState, setGameState] = useState("name-input") // 'name-input', 'playing', 'complete'
  const [playerName, setPlayerName] = useState("")
  const [gameStartTime, setGameStartTime] = useState(null)
  const [gameEndTime, setGameEndTime] = useState(null)
  const [totalMoves, setTotalMoves] = useState(0)
  const navigate = useNavigate()

  // **Lógica centralizada para determinar la categoría y dificultad**
  // Prioriza las props que le llegan, luego localStorage, y finalmente un valor por defecto.
  const [currentCategory, setCurrentCategory] = useState(
    initialCategory || localStorage.getItem("selectedCategory") || "musicians",
  )
  const [currentDifficulty, setCurrentDifficulty] = useState(
    initialDifficulty || localStorage.getItem("selectedDifficulty") || "Easy",
  )

  // Si las props iniciales cambian (ej. por navegación con nuevos parámetros), actualiza el estado
  useEffect(() => {
    setCurrentCategory(initialCategory || localStorage.getItem("selectedCategory") || "musicians")
    setCurrentDifficulty(initialDifficulty || localStorage.getItem("selectedDifficulty") || "Easy")
  }, [initialCategory, initialDifficulty])

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
    setGameState("playing") // Vuelve directamente a jugar, manteniendo el mismo nombre
    setGameStartTime(Date.now())
    setGameEndTime(null)
    setTotalMoves(0)
    // No es necesario recargar imágenes aquí, MemoryGameBackend lo hará con el useEffect
  }

  // La función handleBackToMenu ya no se pasa a GameComplete,
  // ya que el Layout dentro de GameComplete manejará la navegación.
  // Puedes eliminar esta función si no se usa en ningún otro lugar de EnhancedMemoryGameUpdated.
  // const handleBackToMenu = () => {
  //   navigate("/");
  // };

  const gameTime = gameEndTime && gameStartTime ? (gameEndTime - gameStartTime) / 1000 : 0

  if (gameState === "name-input") {
    return (
      <PlayerNameInput
        onNameSubmit={handleNameSubmit}
        currentCategory={currentCategory} // Pasa los valores determinados
        currentDifficulty={currentDifficulty} // Pasa los valores determinados
      />
    )
  }

  if (gameState === "complete") {
    return (
      <GameComplete
        playerName={playerName}
        category={currentCategory} // Usa la categoría determinada
        difficulty={currentDifficulty.toLowerCase()} // Convierte a minúsculas para el backend
        gameTime={gameTime}
        totalMoves={totalMoves}
        onPlayAgain={handlePlayAgain}
        // onBackToMenu se elimina de aquí
      />
    )
  }

  // Estado de juego - muestra tu componente MemoryGameBackend
  return (
    <MemoryGameBackend
      category={currentCategory} // Usa la categoría determinada
      difficulty={currentDifficulty} // Usa la dificultad determinada (manteniendo mayúsculas/minúsculas si es necesario para tu componente)
      playerName={playerName}
      onGameComplete={handleGameComplete}
      onMoveCount={handleMoveCount}
    />
  )
}

export default EnhancedMemoryGameUpdated
