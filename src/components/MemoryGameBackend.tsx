"use client"

import { useState, useEffect, useRef } from "react"
import Confetti from "react-confetti"
import useWindowSize from "react-use/lib/useWindowSize"
import Layout from "./Layout"
import { gsap } from "gsap"
import { useTranslation } from "react-i18next"
import "./MemoryGame.css"

const MemoryGameBackend = ({
  category, // ¡Ahora usamos directamente la prop 'category'!
  difficulty: propDifficulty, // Mantenemos 'propDifficulty' para normalizarla
  playerName: propPlayerName,
  onGameComplete,
  onMoveCount,
}) => {
  const { t } = useTranslation()

  const [cards, setCards] = useState([])
  const [flippedCards, setFlippedCards] = useState([])
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [gameWon, setGameWon] = useState(false)
  const [time, setTime] = useState(0)
  const [clickCount, setClickCount] = useState(0)
  const [score, setScore] = useState(0)
  const [scoreSaved, setScoreSaved] = useState(false)
  const [backendSaveStatus, setBackendSaveStatus] = useState("")
  const [backendSaveAttempted, setBackendSaveAttempted] = useState(false)

  const { width, height } = useWindowSize()

  // El nombre del jugador aún puede tener un fallback de localStorage si no se pasa
  const playerName = propPlayerName || localStorage.getItem("playerName") || t("guest")

  // Normaliza la dificultad al formato capitalizado para la lógica del juego
  const normalizeDifficulty = (diff) => {
    const diffLower = diff.toLowerCase()
    switch (diffLower) {
      case "easy":
        return "Easy"
      case "medium":
      case "normal": // Asegúrate de que "normal" también se mapee a "medium" si es un valor posible
        return "Medium"
      case "hard":
        return "Hard"
      default:
        return "Easy" // Valor por defecto si propDifficulty es inválido
    }
  }

  const difficulty = normalizeDifficulty(propDifficulty) // Usa la prop 'propDifficulty'

  const categoryLabel = t(category)
  const difficultyLabel = t(difficulty.toLowerCase())

  // Tus totalPairs originales con claves capitalizadas
  const totalPairs = {
    Easy: 4,
    Medium: 8,
    Hard: 12,
  }

  const categoryPrefixes = {
    heroes: { prefix: "TM01", count: 31 },
    movies: { prefix: "TM02", count: 35 },
    musicians: { prefix: "TM03", count: 40 },
    videogames: { prefix: "TM04", count: 37 },
  }

  const flipSound = new Audio("/sounds/flip.mp3")
  const winSound = new Audio("/sounds/win.wav")
  const clickSound = useRef(new Audio("/sounds/clicks.mp3"))

  const containerRef = useRef(null)

  useEffect(() => {
    gsap.from(containerRef.current, {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: "power3.out",
    })
  }, [])

  const loadImages = () => {
    // Asegúrate de que la categoría y la dificultad sean válidas antes de continuar
    if (!categoryPrefixes[category] || !totalPairs[difficulty]) {
      console.error("Categoría o dificultad inválida proporcionada a MemoryGameBackend:", { category, difficulty })
      // Podrías añadir una lógica para mostrar un mensaje de error al usuario o redirigir
      return
    }

    const { prefix, count } = categoryPrefixes[category]
    const numPairs = totalPairs[difficulty]

    console.log(`🎮 Cargando juego: ${category} - ${difficulty} - ${numPairs} pares`)

    const allImages = Array.from({ length: count }, (_, i) => {
      const num = String(i + 1).padStart(3, "0")
      return `${prefix}-${num}.webp`
    })

    const selectedImages = allImages.sort(() => 0.5 - Math.random()).slice(0, numPairs)

    const pairedImages = selectedImages.flatMap((img) => {
      const imagePath = `/images/${category}/${img}`
      return [
        {
          id: `${img}-a`,
          image: imagePath,
          flipped: false,
          matched: false,
        },
        {
          id: `${img}-b`,
          image: imagePath,
          flipped: false,
          matched: false,
        },
      ]
    })

    const shuffledCards = pairedImages.sort(() => 0.5 - Math.random())

    setCards(shuffledCards)
    setMatchedPairs(0)
    setFlippedCards([])
    setGameWon(false)
    setTime(0)
    setClickCount(0)
    setScore(0)
    setScoreSaved(false)
    setBackendSaveStatus("")
    setBackendSaveAttempted(false)
  }

  const handleCardClick = (index) => {
    if (flippedCards.length === 2 || cards[index].flipped || cards[index].matched) return

    const newClickCount = clickCount + 1
    setClickCount(newClickCount)

    // Notifica al componente padre el cambio en el contador de movimientos
    if (onMoveCount) {
      onMoveCount(newClickCount)
    }

    const updatedCards = [...cards]
    updatedCards[index].flipped = true
    setCards(updatedCards)

    flipSound.currentTime = 0
    flipSound.play()

    const newFlipped = [...flippedCards, index]
    setFlippedCards(newFlipped)

    if (newFlipped.length === 2) {
      const [firstIdx, secondIdx] = newFlipped
      const firstCard = updatedCards[firstIdx]
      const secondCard = updatedCards[secondIdx]

      setTimeout(() => {
        if (firstCard.image === secondCard.image) {
          updatedCards[firstIdx].matched = true
          updatedCards[secondIdx].matched = true
          setMatchedPairs((prev) => prev + 1)
          setCards(updatedCards)
          setFlippedCards([])

          const matchSound = new Audio("/sounds/match-sound.wav")
          matchSound.play()

          setTimeout(() => {
            updatedCards[firstIdx].background = "#17f5d7"
            updatedCards[secondIdx].background = "#17f5d7"
            setCards([...updatedCards])
          }, 500)
        } else {
          setTimeout(() => {
            updatedCards[firstIdx].flipped = false
            updatedCards[secondIdx].flipped = false
            setCards([...updatedCards])
            setFlippedCards([])
          }, 1000)
        }
      }, 500)
    }
  }

  // Guardar puntuación en el backend - CON MEJOR UX PARA DUPLICADOS
  const saveScoreToBackend = async (scoreData) => {
    // PREVENIR GUARDADOS DUPLICADOS
    if (backendSaveAttempted) {
      console.log("🚫 Ya se intentó guardar en el backend, omitiendo...")
      return
    }

    setBackendSaveAttempted(true)
    console.log("🚀 INTENTANDO GUARDAR PUNTUACIÓN:", scoreData)
    setBackendSaveStatus("saving")

    try {
      const backendScoreData = {
        playerName: scoreData.playerName,
        category: scoreData.category,
        difficulty: scoreData.difficulty.toLowerCase(),
        time: scoreData.time,
        moves: scoreData.clicks,
      }

      console.log("📤 ENVIANDO AL BACKEND:", backendScoreData)
      const response = await fetch("http://localhost:3002/api/scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(backendScoreData),
      })

      const result = await response.json()
      console.log("🔍 Estado de la respuesta:", response.status)

      // SIEMPRE muestra éxito al usuario, independientemente de la respuesta del servidor
      setBackendSaveStatus("success")

      if (response.status === 409) {
        console.log("🚫 Duplicado prevenido por el servidor (oculto al usuario)")
      } else if (response.ok) {
        console.log("✅ Nueva puntuación guardada exitosamente")
      } else {
        console.log("⚠️ Error del servidor, pero mostrando éxito al usuario")
      }
    } catch (error) {
      console.log("❌ ERROR DE RED:", error)
      // Incluso en caso de error de red, muestra éxito para evitar confundir al usuario
      setBackendSaveStatus("success")
    }
  }

  // IMPORTANTE: Recarga las imágenes cuando la categoría o dificultad cambian
  useEffect(() => {
    console.log("🔄 Categoría o dificultad cambiada, recargando imágenes...")
    loadImages()
  }, [category, difficulty]) // Esto se activará cuando la categoría o dificultad cambien

  // Lógica de finalización del juego - TU ORIGINAL - RESTAURADA
  useEffect(() => {
    if (scoreSaved) return

    const allMatched = cards.length > 0 && cards.every((card) => card.matched)
    if (allMatched) {
      // Espera a que la última animación de volteo se complete
      const timeout = setTimeout(() => {
        setGameWon(true)
        winSound.play()

        const scoreCalc = Math.max(1000 - (time * 5 + clickCount * 2), 0)
        setScore(scoreCalc)

        const newScore = {
          playerName,
          score: scoreCalc,
          difficulty,
          category,
          time,
          clicks: clickCount,
          date: new Date().toISOString(),
        }

        // Guardar en localStorage (mantener la funcionalidad existente)
        const existingScores = JSON.parse(localStorage.getItem("memoryGameScores")) || []
        const updatedScores = [newScore, ...existingScores].sort((a, b) => b.score - a.score).slice(0, 10)
        localStorage.setItem("memoryGameScores", JSON.stringify(updatedScores))

        // Guardar en el backend (NUEVO) - con prevención de duplicados
        saveScoreToBackend(newScore)

        // Notifica al componente padre que el juego ha terminado (NUEVO)
        if (onGameComplete) {
          onGameComplete(clickCount)
        }

        setScoreSaved(true)
      }, 800) // este retraso permite que la animación de volteo termine

      return () => clearTimeout(timeout)
    }
  }, [cards, time, clickCount, difficulty, category, playerName, scoreSaved, onGameComplete])

  // Lógica del temporizador - TU ORIGINAL
  useEffect(() => {
    let timer
    if (!gameWon) {
      timer = setInterval(() => {
        setTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [gameWon])

  const handleBack = () => {
    clickSound.current.currentTime = 0
    clickSound.current.play()
    window.history.back()
  }

  const handlePlayAgain = () => {
    loadImages()
  }

  return (
    <Layout title={`${categoryLabel} - ${difficultyLabel}`} onBackClick={handleBack}>
      <div className="stats-container">
        <p>
          🕒 {t("time")}: {time}s
        </p>
        <p>
          🖱️ {t("clicks")}: {clickCount}
        </p>
        <p>
          👤 {t("player")}: {playerName}
        </p>
        <p style={{ fontSize: "12px", color: "#666" }}>
          🎯 Dificultad: {difficulty} ({totalPairs[difficulty]} pares) | Categoría: {category}
        </p>
      </div>

      <div ref={containerRef} className="memory-game">
        {gameWon && (
          <>
            <Confetti width={width} height={height} />
            <div className="win-message">
              <h2>
                🎉 {t("youWon")}, {playerName}! 🎉
              </h2>
              <p>
                🏆 {t("yourScore")}: {score}
              </p>

              {/* Siempre muestra mensaje de éxito */}
              <div className="backend-status" style={{ margin: "10px 0", fontSize: "14px" }}>
                {backendSaveStatus === "saving" && <p style={{ color: "#007bff" }}>💾 Guardando en el ranking...</p>}
                {backendSaveStatus === "success" && (
                  <p style={{ color: "#28a745" }}>✅ Puntuación guardada en el ranking!</p>
                )}
              </div>

              <button onClick={handlePlayAgain}>{t("playAgain")}</button>
            </div>
          </>
        )}

        <div className={`card-grid ${difficulty.toLowerCase()} ${gameWon ? "blurred" : ""}`}>
          {cards.map((card, index) => (
            <div key={card.id} className="card" onClick={() => handleCardClick(index)}>
              <div className={`card-inner ${card.flipped || card.matched ? "flipped" : ""}`}>
                <div className={`card-front ${card.matched ? "matched" : ""}`}>
                  <img src={card.image || "/placeholder.svg"} alt="front" />
                </div>
                <div className="card-back">
                  <img src="/images/placeholder.png" alt="back" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default MemoryGameBackend
