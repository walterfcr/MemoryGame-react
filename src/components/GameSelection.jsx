"use client"

import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import Layout from "./Layout" // Asumiendo que tienes un componente Layout
import "./GameSelection.css" // Nuevo archivo CSS para este componente

function GameSelection() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const clickSound = useRef(new Audio("/sounds/click.wav"))

  const [selectedCategory, setSelectedCategory] = useState(localStorage.getItem("selectedCategory") || "musicians")
  const [selectedDifficulty, setSelectedDifficulty] = useState(localStorage.getItem("selectedDifficulty") || "Easy")

  const categories = [
    { id: "heroes", name: t("heroes") },
    { id: "movies", name: t("movies") },
    { id: "musicians", name: t("musicians") },
    { id: "videogames", name: t("videogames") },
  ]

  const difficulties = [
    { id: "Easy", name: t("easy") },
    { id: "Medium", name: t("medium") },
    { id: "Hard", name: t("hard") },
  ]

  const playClickSound = () => {
    if (clickSound.current) {
      clickSound.current.currentTime = 0
      clickSound.current.play()
    }
  }

  const handleStartGame = () => {
    playClickSound()
    // Guardar selecciones en localStorage
    localStorage.setItem("selectedCategory", selectedCategory)
    localStorage.setItem("selectedDifficulty", selectedDifficulty)
    // Navegar a la página del juego
    navigate("/game") // Asumiendo que tu ruta de juego es /game
  }

  const handleBack = () => {
    playClickSound()
    navigate("/") // Navegar de vuelta al menú principal
  }

  return (
    <Layout title={t("selectGameOptions") || "Select Game Options"} onBackClick={handleBack}>
      <div className="game-selection-container">
        <h2 className="selection-title">{t("chooseCategory") || "Choose Category"}</h2>
        <div className="category-buttons">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`selection-button ${selectedCategory === cat.id ? "active" : ""}`}
              onClick={() => {
                playClickSound()
                setSelectedCategory(cat.id)
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <h2 className="selection-title">{t("chooseDifficulty") || "Choose Difficulty"}</h2>
        <div className="difficulty-buttons">
          {difficulties.map((diff) => (
            <button
              key={diff.id}
              className={`selection-button ${selectedDifficulty === diff.id ? "active" : ""}`}
              onClick={() => {
                playClickSound()
                setSelectedDifficulty(diff.id)
              }}
            >
              {diff.name}
            </button>
          ))}
        </div>

        <button className="start-game-main-button" onClick={handleStartGame}>
          {t("playGame") || "Play Game"}
        </button>
      </div>
    </Layout>
  )
}

export default GameSelection
