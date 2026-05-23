"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { gsap } from "gsap"
import Layout from "../components/Layout"
import "./DifficultySelector.css" 
import { useTranslation } from "react-i18next"

const DifficultySelector = ({ onSelect }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const containerRef = useRef(null)

  // persist selected difficulty between sessions
  const [selectedDifficulty, setSelectedDifficulty] = useState(localStorage.getItem("selectedDifficulty") || null)

  const clickSound = useRef(new Audio("/sounds/click.wav"))
  const playSound = () => {
    clickSound.current.currentTime = 0
    clickSound.current.play()
  }

  // animate page entrance on mount
  useEffect(() => {
    document.title = "Memory Game - Select Difficulty"
    gsap.from(containerRef.current, {
      x: "100vw",
      opacity: 0,
      duration: 0.6,
      ease: "power3.out",
    })
  }, [])

  const getLogoByDifficulty = (difficulty) => {
    switch (difficulty) {
      case "Medium":
        return "/images/difficulty-logo2.png"
      case "Hard":
        return "/images/difficulty-logo3.png"
      default:
        return "/images/difficulty-logo1.png"
    }
  }

  const handleSelect = (difficulty) => {
    playSound()
    setSelectedDifficulty(difficulty)
    localStorage.setItem("selectedDifficulty", difficulty)
    if (onSelect) {
      onSelect(difficulty)
    }
  }

  const handleBackClick = () => {
    playSound()
    // delay navigation slightly so the click sound can finish playing
    setTimeout(() => navigate("/menu"), 150) 
  }

  return (
    <Layout title={t("SelectDifficulty")} onBackClick={handleBackClick}>
      <div className="difficultyContainer" ref={containerRef}>
        <h1>{t("SelectDifficulty")}</h1>
        <img src={getLogoByDifficulty(selectedDifficulty) || "/placeholder.svg"} alt="Logo" className="logoImage" />
        <button
          className={`tabButtonDifficulty ${selectedDifficulty === "Easy" ? "active" : ""}`}
          onClick={() => handleSelect("Easy")}
        >
          {t("easy")}
        </button>
        <button
          className={`tabButtonDifficulty ${selectedDifficulty === "Medium" ? "active" : ""}`}
          onClick={() => handleSelect("Medium")}
        >
          {t("medium")}
        </button>
        <button
          className={`tabButtonDifficulty ${selectedDifficulty === "Hard" ? "active" : ""}`}
          onClick={() => handleSelect("Hard")}
        >
          {t("hard")}
        </button>
      </div>
    </Layout>
  )
}

export default DifficultySelector
