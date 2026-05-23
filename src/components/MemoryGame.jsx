"use client"

import { useEffect, useRef } from "react"
import Confetti from "react-confetti"
import Layout from "./Layout"
import { gsap } from "gsap"
import { useTranslation } from "react-i18next"
import { useAudio } from "../context/AudioContext"
import { useAuth } from "../context/AuthContext"
import { calculateScore } from "../utils/calculateScore"
import { normalizeDifficulty } from "../utils/normalizeDifficulty"
import { saveLocalScore } from "../utils/saveLocalScore"
import { saveScore } from "../services/scoreService"
import { useAudioEffects } from "../hooks/useAudioEffects"
import { useMemoryGame } from "../hooks/useMemoryGame"
import "./MemoryGame.css"


const MemoryGame = ({
  category,
  difficulty: propDifficulty,
  onGameComplete,
  onMoveCount,
}) => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { isMuted } = useAudio() 

  // fallback to email prefix when displayName is unavailable
  const playerName = user?.displayName || user?.email?.split("@")[0] || t("guest")

  const containerRef = useRef(null)

  // animate game container on mount
  useEffect(() => {
  gsap.from(containerRef.current, {
    opacity: 0,
    y: 30,
    duration: 1,
    ease: "power3.out",
  })
  }, [])

  const {
  playFlip,
  playMatch,
  playWin,
  playClick,
  } = useAudioEffects(isMuted)

  // normalize route difficulty values into a consistent format
  const difficulty = normalizeDifficulty(propDifficulty)

  const {
  cards,
  gameWon,
  setGameWon,
  time,
  clickCount,
  score,
  setScore,
  scoreSaved,
  setScoreSaved,
  resetGame,
  handleCardClick,
  } = useMemoryGame(category, difficulty)


  useEffect(() => {
    // detect game completion and persist final score
    const allMatched = cards.length > 0 && cards.every((c) => c.matched)

    if (allMatched && !scoreSaved) {
      setGameWon(true)
      
      playWin()

      // calculate score based on time and move efficiency
      const finalScore = calculateScore(time, clickCount)
      setScore(finalScore)

      const newScore = {
        playerName,
        score: finalScore,
        difficulty,
        category,
        time,
        clicks: clickCount,
        date: new Date().toISOString(),
        uid: user?.uid,
      }

      // persist score locally and in Firestore
      saveLocalScore(newScore)
      saveScore(newScore)

      if (onGameComplete) onGameComplete(clickCount)

      setScoreSaved(true)
    }
  }, [cards,
      time,
      clickCount,
      scoreSaved,
      category,
      difficulty,
      playerName,
      onGameComplete,
      user,
      playWin,
      setGameWon,
      setScore,
      setScoreSaved,
      ])


  const handleBack = () => {
  playClick()
  window.history.back()
 }

  const handlePlayAgain = () => {
  playClick()
  resetGame()
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
            <div key={card.id}
                className="card" 
                // delegate game logic and audio handling to custom hook
                onClick={() =>
                  handleCardClick(
                    index,
                    onMoveCount,
                    playFlip,
                    playMatch
                  )
               }  
            >
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