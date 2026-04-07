"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Confetti from "react-confetti"
import Layout from "./Layout"
import { gsap } from "gsap"
import { useTranslation } from "react-i18next"
import { addDoc, collection } from "firebase/firestore"
import { db } from "../firebase"
import "./MemoryGame.css"

// constants
const totalPairs = {
  Easy: 4,
  Medium: 8,
  Hard: 12,
}

const categoryPrefixes = {
  heroes: { prefix: "TM01", count: 30 },
  movies: { prefix: "TM02", count: 24 },
  musicians: { prefix: "TM03", count: 30 },
  videogames: { prefix: "TM04", count: 36 },
}

const MemoryGame = ({
  category,
  difficulty: propDifficulty,
  playerName: propPlayerName,
  onGameComplete,
  onMoveCount,
}) => {
  const { t } = useTranslation()

  const [cards, setCards] = useState([])
  const [flippedCards, setFlippedCards] = useState([])
  const [gameWon, setGameWon] = useState(false)
  const [time, setTime] = useState(0)
  const [clickCount, setClickCount] = useState(0)
  const [score, setScore] = useState(0)
  const [scoreSaved, setScoreSaved] = useState(false)

  const playerName = propPlayerName || localStorage.getItem("playerName") || t("guest")

  // sounds
  const flipSound = useRef(new Audio("/sounds/flip.mp3"))
  const winSound = useRef(new Audio("/sounds/win.wav"))
  const clickSound = useRef(new Audio("/sounds/click.wav"))
  const matchSound = useRef(new Audio("/sounds/match-sound.wav"))

  const containerRef = useRef(null)

  useEffect(() => {
    gsap.from(containerRef.current, {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: "power3.out",
    })
  }, [])

  const normalizeDifficulty = (diff) => {
    switch (diff.toLowerCase()) {
      case "easy":
        return "Easy"
      case "medium":
      case "normal":
        return "Medium"
      case "hard":
        return "Hard"
      default:
        return "Easy"
    }
  }

  const difficulty = normalizeDifficulty(propDifficulty)

  const loadImages = useCallback(() => {
    const { prefix, count } = categoryPrefixes[category]
    const numPairs = totalPairs[difficulty]

    const allImages = Array.from({ length: count }, (_, i) => {
      const num = String(i + 1).padStart(3, "0")
      return `${prefix}-${num}.webp`
    })

    const selectedImages = allImages.sort(() => 0.5 - Math.random()).slice(0, numPairs)

    const paired = selectedImages.flatMap((img) => {
      const path = `/images/${category}/${img}`
      return [
        { id: `${img}-a`, image: path, flipped: false, matched: false, highlight: false },
        { id: `${img}-b`, image: path, flipped: false, matched: false, highlight: false },
      ]
    })

    setCards(paired.sort(() => 0.5 - Math.random()))
    setFlippedCards([])
    setGameWon(false)
    setTime(0)
    setClickCount(0)
    setScore(0)
    setScoreSaved(false)
  }, [category, difficulty])

  useEffect(() => {
    loadImages()
  }, [loadImages])

  const handleCardClick = (index) => {
    if (flippedCards.length === 2 || cards[index].flipped || cards[index].matched) return

    const newClicks = clickCount + 1
    setClickCount(newClicks)

    if (onMoveCount) onMoveCount(newClicks)

    const updated = [...cards]
    updated[index].flipped = true
    setCards(updated)

    flipSound.current.currentTime = 0
    flipSound.current.play()

    const newFlipped = [...flippedCards, index]
    setFlippedCards(newFlipped)

    if (newFlipped.length === 2) {
      const [a, b] = newFlipped

      setTimeout(() => {
        if (updated[a].image === updated[b].image) {
          updated[a].matched = true
          updated[b].matched = true

          // ✅ STEP 1 FIX: highlight cards
          updated[a].highlight = true
          updated[b].highlight = true

          matchSound.current.currentTime = 0
          matchSound.current.play()

          setCards([...updated])

          // remove highlight after short delay
          setTimeout(() => {
            updated[a].highlight = false
            updated[b].highlight = false
            setCards([...updated])
          }, 600)
        } else {
          updated[a].flipped = false
          updated[b].flipped = false
          setCards([...updated])
        }
        setFlippedCards([])
      }, 700)
    }
  }

  const saveScoreToFirebase = async (scoreData) => {
    try {
      console.log("🔥 Saving to Firebase:", scoreData)
      await addDoc(collection(db, "scores"), scoreData)
      console.log("✅ Score saved!")
    } catch (error) {
      console.error("❌ Firebase error:", error)
    }
  }

  useEffect(() => {
    const allMatched = cards.length > 0 && cards.every((c) => c.matched)

    if (allMatched && !scoreSaved) {
      setGameWon(true)
      winSound.current.play()

      const finalScore = Math.max(1000 - (time * 5 + clickCount * 2), 0)
      setScore(finalScore)

      const newScore = {
        playerName,
        score: finalScore,
        difficulty,
        category,
        time,
        clicks: clickCount,
        date: new Date().toISOString(),
      }

      const local = JSON.parse(localStorage.getItem("memoryGameScores") || "[]")
      localStorage.setItem("memoryGameScores", JSON.stringify([newScore, ...local].slice(0, 10)))

      saveScoreToFirebase(newScore)

      if (onGameComplete) onGameComplete(clickCount)

      setScoreSaved(true)
    }
  }, [cards, time, clickCount, scoreSaved, category, difficulty, playerName, onGameComplete])

  useEffect(() => {
    if (gameWon) return

    const timer = setInterval(() => {
      setTime((t) => t + 1)
    }, 1000)

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
    <Layout title={`${category} - ${difficulty}`} onBackClick={handleBack}>
      <div className="stats-container">
        <p>🕒 {t("time")}: {time}s</p>
        <p>🖱️ {t("clicks")}: {clickCount}</p>
        <p>👤 {t("player")}: {playerName}</p>
      </div>

      <div ref={containerRef} className="memory-game">
        {gameWon && (
          <>
            <Confetti />
            <div className="win-message">
              <h2>🎉 {t("youWon")} {playerName}!</h2>
              <p>🏆 {t("yourScore")}: {score}</p>

              <button onClick={handlePlayAgain}>{t("playAgain")}</button>
            </div>
          </>
        )}

        <div className={`card-grid ${difficulty.toLowerCase()} ${gameWon ? "blurred" : ""}`}>
          {cards.map((card, index) => (
            <div key={card.id} className="card" onClick={() => handleCardClick(index)}>
              <div className={`card-inner ${card.flipped || card.matched ? "flipped" : ""}`}>
                <div className={`card-front ${card.matched ? "matched" : ""} ${card.highlight ? "highlight" : ""}`}>
                  <img src={card.image} alt="front" />
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

export default MemoryGame