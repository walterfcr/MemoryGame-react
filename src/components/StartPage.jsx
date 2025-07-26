"use client"

import { useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { gsap } from "gsap"
import "./StartPage.css"
import { useTranslation } from "react-i18next"
import { useAuth } from "../context/AuthContext"
import Layout from "./Layout" // IMPORTAR EL COMPONENTE LAYOUT

const StartPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const { isAuthenticated, user } = useAuth()

  // Sound effect
  const clickSound = useRef(new Audio("/sounds/click.wav"))
  const playSound = () => {
    if (clickSound.current) {
      clickSound.current.currentTime = 0
      clickSound.current.play()
    }
  }

  const handleNavigate = (path) => {
    playSound()
    gsap.to(containerRef.current, {
      x: "-100vw",
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => navigate(path),
    })
  }

  useEffect(() => {
    gsap.from(containerRef.current, {
      opacity: 0,
      y: 30,
      duration: 0.5,
      ease: "power2.out",
    })
  }, [])

  return (
    // ENVOLVER CON LAYOUT Y PASAR EL TÍTULO
    <Layout title={t("memoryGame")} onBackClick={null}>
      {" "}
      {/* StartPage no tiene botón de volver */}
      <div className="startPageContainer" ref={containerRef}>
        <img src="/images/logo.png" alt="Logo" className="logoImage" />
        <div className="tabsContainer">
          {!isAuthenticated ? (
            <button onClick={() => handleNavigate("/login")} className="tabButton">
              {t("login")}
            </button>
          ) : (
            <button onClick={() => handleNavigate("/profile")} className="tabButton">
              {t("profile")}
            </button>
          )}
          <button onClick={() => handleNavigate("/difficulty")} className="tabButton">
            {t("difficulty")}
          </button>
          <button onClick={() => handleNavigate("/categories")} className="tabButton">
            {t("category")}
          </button>
          <button onClick={() => handleNavigate("/Leaderboard")} className="tabButton">
            {t("leaderboard")}
          </button>
          <button onClick={() => handleNavigate("/language")} className="tabButton">
            {t("language")}
          </button>
          <button onClick={() => handleNavigate("/credits")} className="tabButton">
            {t("credits")}
          </button>
        </div>
        <button onClick={() => handleNavigate("/play")} className="playButton">
          {t("play")}
        </button>
      </div>
    </Layout>
  )
}

export default StartPage
