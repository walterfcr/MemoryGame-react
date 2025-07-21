"use client"

import { useState, useRef } from "react"
import { useTranslation } from "react-i18next"
import Layout from "./Layout" // Importa el componente Layout
import "./PlayerNameInput.css" // Importa el nuevo archivo CSS
import { useNavigate } from "react-router-dom"

function PlayerNameInput({ onNameSubmit, currentCategory, currentDifficulty }) {
  const { t } = useTranslation()
  const [playerName, setPlayerName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const clickSound = useRef(new Audio("/sounds/click.wav")) // Asumiendo que tienes este sonido

  const playClickSound = () => {
    if (clickSound.current) {
      clickSound.current.currentTime = 0
      clickSound.current.play()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    playClickSound() // Reproducir sonido al enviar
    if (playerName.trim()) {
      setIsSubmitting(true)
      onNameSubmit(playerName.trim())
    }
  }

  // No hay botón de "volver" directo en este componente,
  // ya que es el inicio del flujo del juego.
  // El Layout se usará solo para el título.
  const handleBack = () => {
    playClickSound() // Reproduce el sonido al hacer clic en volver
    navigate("/") // Navega de vuelta a la página principal usando react-router-dom
  }

  return (
    <Layout title={t("readyToPlay") || "Ready to Play!"} onBackClick={handleBack}>
      <div className="player-name-container">
        <img src="/images/login-logo.png" alt="Logo" className="logoImage" />
        <p className="game-details">
          <strong>{t("category")}:</strong> {currentCategory} | <strong>{t("difficulty")}:</strong> {currentDifficulty}
        </p>

        <form onSubmit={handleSubmit} className="player-name-form">
          <div className="input-group">
            <label htmlFor="playerName" className="input-label">
              {t("enterYourName")}:
            </label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder={t("yourNameHere") || "Your name here..."}
              maxLength={20}
              className="player-name-input"
              disabled={isSubmitting}
            />
          </div>

          <button type="submit" disabled={!playerName.trim() || isSubmitting} className="start-game-button">
            {isSubmitting ? t("startingGame") : t("startGame")}
          </button>
        </form>

      </div>
    </Layout>
  )
}

export default PlayerNameInput
