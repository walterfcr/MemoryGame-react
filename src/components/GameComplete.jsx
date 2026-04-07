"use client"

import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "./Layout"
import "./GameComplete.css"
import { useTranslation } from "react-i18next"

// Firebase
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase"

function GameComplete({ playerName, category, difficulty, gameTime, totalMoves, onPlayAgain }) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [saveStatus, setSaveStatus] = useState("idle")

  const clickSound = useRef(new Audio("/sounds/click.wav"))

  const playClickSound = () => {
    clickSound.current.currentTime = 0
    clickSound.current.play()
  }

  useEffect(() => {
    const saveScore = async () => {
      if (saveStatus !== "idle") return

      setSaveStatus("saving")

      try {
        const score = Math.max(1000 - (gameTime * 5 + totalMoves * 2), 0)

        const scoreData = {
          playerName,
          category,
          difficulty,
          time: Math.round(gameTime),
          clicks: totalMoves,
          score,
          date: new Date().toISOString(),
        }

        console.log("🔥 Saving to Firebase:", scoreData)

        await addDoc(collection(db, "scores"), {
          ...scoreData,
          createdAt: serverTimestamp(),
        })

        console.log("✅ Score saved!")
        setSaveStatus("success")
      } catch (error) {
        console.error("❌ Error:", error)
        setSaveStatus("error")
      }
    }

    saveScore()
  }, [playerName, category, difficulty, gameTime, totalMoves])

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
        <h1>🎉 {t("congratulations")}!</h1>

        <div className="score-summary-card">
          <h3>📊 {t("yourScore")}</h3>
          <p><strong>{t("player")}:</strong> {playerName}</p>
          <p><strong>{t("category")}:</strong> {category}</p>
          <p><strong>{t("difficulty")}:</strong> {difficulty}</p>
          <p><strong>{t("time")}:</strong> {formatTime(gameTime)}</p>
          <p><strong>{t("moves")}:</strong> {totalMoves}</p>
        </div>

        <div className="save-status-message">
          {saveStatus === "saving" && <p>💾 {t("savingScore")}</p>}
          {saveStatus === "success" && <p>✅ {t("scoreSavedSuccess")}</p>}
          {saveStatus === "error" && <p>❌ {t("scoreSaveError")}</p>}
        </div>

        <div className="action-buttons-container">
          <button onClick={onPlayAgain}>🔄 {t("playAgain")}</button>
          <button onClick={handleBackToMenu}>🏠 {t("backToMenu")}</button>
        </div>
      </div>
    </Layout>
  )
}

export default GameComplete