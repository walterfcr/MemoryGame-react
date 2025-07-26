"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "./Layout"
import { gsap } from "gsap"
import { useTranslation } from "react-i18next"
import { useAuth } from "../context/AuthContext" // Corrected path
import "./Login.css" // Mantener los estilos existentes

export function PlayerNameEntry({ onNameSubmit }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const clickSound = useRef(new Audio("/sounds/click.wav"))
  const [name, setName] = useState("")
  const { isAuthenticated, user } = useAuth()

  const playClickSound = () => {
    clickSound.current.currentTime = 0
    clickSound.current.play()
  }

  useEffect(() => {
    gsap.from(containerRef.current, {
      x: "100vw",
      opacity: 0,
      duration: 0.6,
      ease: "power3.out",
    })
  }, [])

  useEffect(() => {
    if (isAuthenticated && user?.username) {
      onNameSubmit(user.username)
    }
  }, [isAuthenticated, user, onNameSubmit])

  const handleBack = () => {
    playClickSound()
    navigate("/")
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim()) {
      localStorage.setItem("playerName", name.trim())
      playClickSound()
      onNameSubmit(name.trim())
    }
  }

  if (isAuthenticated && user?.username) {
    return null // If authenticated, this component doesn't need to render
  }

  return (
    <Layout title={t("enterYourName")} onBackClick={handleBack}>
      <div ref={containerRef} className="loginContent">
        <img src="/images/login-logo.png" alt="Logo" className="logoImage" />
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">{t("enterYourName")}:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("yourName")}
            required
          />
          <button type="submit">{t("start")}</button>
        </form>
      </div>
    </Layout>
  )
}

export default PlayerNameEntry
