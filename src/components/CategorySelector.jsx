"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "./Layout"
import { gsap } from "gsap"
import "./CategorySelector.css" // Este archivo CSS ya existe y no se modificará
import { useTranslation } from "react-i18next"

const CategorySelector = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const containerRef = useRef(null) // Ref for animation
  const [selectedCategory, setSelectedCategory] = useState(localStorage.getItem("selectedCategory") || "heroes")

  // Button click sound using useRef to avoid reloading
  const buttonClickSound = useRef(new Audio("/sounds/click.wav"))
  const playSound = () => {
    buttonClickSound.current.currentTime = 0
    buttonClickSound.current.play()
  }

  const handleSelect = (category) => {
    playSound()
    setSelectedCategory(category)
    localStorage.setItem("selectedCategory", category)
  }

  const handleBackClick = () => {
    playSound()
    setTimeout(() => navigate("/"), 150) // Delay navigation to let sound play
  }

  useEffect(() => {
    gsap.from(containerRef.current, {
      x: "100vw",
      opacity: 0,
      duration: 0.6,
      ease: "power3.out",
    })
  }, [])

  const getLogoByCategory = (category) => {
    switch (category) {
      case "movies":
        return "/images/themes-logo2.png"
      case "musicians":
        return "/images/themes-logo4.png"
      case "videogames":
        return "/images/themes-logo3.png"
      default:
        return "/images/themes-logo1.png"
    }
  }

  return (
    <Layout title={t("SelectCategory")} onBackClick={handleBackClick}>
      <div ref={containerRef} className="categoryContainer">
        <h1>{t("SelectCategory")}</h1>
        <img src={getLogoByCategory(selectedCategory) || "/placeholder.svg"} alt="Logo" />
        <button
          className={`tabButtonCategory ${selectedCategory === "heroes" ? "active" : ""}`}
          onClick={() => handleSelect("heroes")}
        >
          {t("heroes")}
        </button>
        <button
          className={`tabButtonCategory ${selectedCategory === "movies" ? "active" : ""}`}
          onClick={() => handleSelect("movies")}
        >
          {t("movies")}
        </button>
        <button
          className={`tabButtonCategory ${selectedCategory === "musicians" ? "active" : ""}`}
          onClick={() => handleSelect("musicians")}
        >
          {t("musicians")}
        </button>
        <button
          className={`tabButtonCategory ${selectedCategory === "videogames" ? "active" : ""}`}
          onClick={() => handleSelect("videogames")}
        >
          {t("videogames")}
        </button>
      </div>
    </Layout>
  )
}

export default CategorySelector
