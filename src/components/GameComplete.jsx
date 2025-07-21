"use client"

import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "./Layout"
import "./GameComplete.css"
import { useTranslation } from "react-i18next"

function GameComplete({ playerName, category, difficulty, gameTime, totalMoves, onPlayAgain }) {
  const { t } = useTranslation()
  // Eliminamos saveStatus y saveMessage ya que no se mostrarán
  // const [saveStatus, setSaveStatus] = useState("saving");
  // const [saveMessage, setSaveMessage] = useState("");
  const navigate = useNavigate()

  const clickSound = useRef(new Audio("/sounds/click.wav"))

  const playClickSound = () => {
    if (clickSound.current) {
      clickSound.current.currentTime = 0
      clickSound.current.play()
    }
  }

  useEffect(() => {
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
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://funko-memory-game-api.onrender.com/api"
        const response = await fetch(`${apiBaseUrl}/scores`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(scoreData),
        })

        const result = await response.json()

        if (response.status === 409) {
          console.log("🚫 Duplicate prevented by server (hidden from user)")
          // Ya no actualizamos saveStatus/saveMessage
        } else if (!response.ok) {
          console.error("Failed to save score:", result.error || "Unknown error")
          // Ya no actualizamos saveStatus/saveMessage
        } else {
          console.log("✅ Score saved successfully!", result.message)
          // Ya no actualizamos saveStatus/saveMessage
        }
      } catch (error) {
        console.error("❌ Failed to save score:", error)
        // Ya no actualizamos saveStatus/saveMessage
      }
    }

    saveScore()
  }, [playerName, category, difficulty, gameTime, totalMoves]) // 't' ya no es necesario en las dependencias si no se usa en el useEffect

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleBackToMenu = () => {
    playClickSound()
    navigate("/")
  }

  return (
    <Layout title={t("gameComplete")} onBackClick={handleBackToMenu}>
      <div className="game-complete-container">
        <h1 className="game-complete-heading">{t("congratulations")}!</h1>

        <div className="score-summary-card">
          <h3>{t("yourScore")}</h3>
          <p>
            <strong>{t("player")}:</strong> {playerName}
          </p>
          <p>
            <strong>{t("category")}:</strong> {category}
          </p>
          <p>
            <strong>{t("difficulty")}:</strong> {difficulty}
          </p>
          <p>
            <strong>{t("time")}:</strong> {formatTime(gameTime)}
          </p>
          <p>
            <strong>{t("clicks")}:</strong> {totalMoves}
          </p>
        </div>

        {/* El bloque de estado de guardado ha sido eliminado */}

        <div className="action-buttons-container">
          <button onClick={onPlayAgain} className="primary-action-button">
             {t("playAgain")}
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default GameComplete
