"use client"

import { useEffect, useRef, useState } from "react" // Added useState for save status
import { useNavigate } from "react-router-dom"
import Layout from "./Layout"
import "./GameComplete.css"
import { useTranslation } from "react-i18next"
import { useAuth } from "../context/AuthContext"

function GameComplete({ playerName, category, difficulty, gameTime, totalMoves, onPlayAgain }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { token, user } = useAuth() // Get user from auth context
  const [saveStatus, setSaveStatus] = useState("idle") // 'idle', 'saving', 'success', 'error'

  const clickSound = useRef(new Audio("/sounds/click.wav"))

  const playClickSound = () => {
    if (clickSound.current) {
      clickSound.current.currentTime = 0
      clickSound.current.play()
    }
  }

  useEffect(() => {
    const saveScore = async () => {
      if (saveStatus !== "idle") return // Prevent multiple save attempts

      setSaveStatus("saving")
      try {
        const scoreData = {
          playerName,
          category,
          difficulty,
          time: Math.round(gameTime),
          moves: totalMoves,
          // userId is now automatically added by the backend's protect middleware
          // if the token is present. No need to send it from client.
        }

        console.log("Saving score:", scoreData)
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3002/api"

        const headers = {
          "Content-Type": "application/json",
        }
        if (token) {
          headers["Authorization"] = `Bearer ${token}`
        }

        const response = await fetch(`${apiBaseUrl}/scores`, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(scoreData),
        })

        const result = await response.json()

        if (response.status === 409) {
          console.log("🚫 Duplicate prevented by server (hidden from user)")
          setSaveStatus("success") // Still show success to user for better UX
        } else if (!response.ok) {
          console.error("Failed to save score:", result.error || "Unknown error")
          setSaveStatus("error")
        } else {
          console.log("✅ Score saved successfully!", result.message)
          setSaveStatus("success")
        }
      } catch (error) {
        console.error("❌ Failed to save score:", error)
        setSaveStatus("error")
      }
    }

    // Only attempt to save if a user is logged in (has a token)
    // and the score hasn't been saved or attempted yet in this session
    if (token && saveStatus === "idle") {
      saveScore()
    } else if (!token) {
      console.log("Skipping score save: User not authenticated.")
      setSaveStatus("skipped") // Indicate that save was skipped
    }
  }, [playerName, category, difficulty, gameTime, totalMoves, token, saveStatus]) // Added saveStatus to dependencies

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
        <h1 className="game-complete-heading">🎉 {t("congratulations")}!</h1>

        <div className="score-summary-card">
          <h3>📊 {t("yourScore")}</h3>
          <p>
            <strong>{t("player")}:</strong> {user?.username || playerName}{" "}
            {/* Use authenticated username if available */}
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
            <strong>{t("moves")}:</strong> {totalMoves}
          </p>
        </div>

        {/* Save Status Message */}
        <div className="save-status-message">
          {saveStatus === "saving" && <p className="saving">💾 {t("savingScore")}</p>}
          {saveStatus === "success" && <p className="success">✅ {t("scoreSavedSuccess")}</p>}
          {saveStatus === "error" && <p className="error">❌ {t("scoreSaveError")}</p>}
          {saveStatus === "skipped" && <p className="info">ℹ️ {t("scoreSaveSkipped")}</p>}
        </div>

        <div className="action-buttons-container">
          <button onClick={onPlayAgain} className="primary-action-button">
            🔄 {t("playAgain")}
          </button>
          <button onClick={handleBackToMenu} className="primary-action-button">
            🏠 {t("backToMenu")}
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default GameComplete
