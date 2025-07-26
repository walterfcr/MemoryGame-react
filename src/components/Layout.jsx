"use client"

import { useRef } from "react"
import { useTranslation } from "react-i18next"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

const Layout = ({ children, title, onBackClick }) => {
  const { t } = useTranslation()
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const clickSound = useRef(new Audio("/sounds/click.wav"))
  const playClickSound = () => {
    if (clickSound.current) {
      clickSound.current.currentTime = 0
      clickSound.current.play()
    }
  }

  const handleLogout = () => {
    playClickSound()
    logout()
  }

  return (
    <div className="mainContainer">
      <header className="navbarContainer">
        {onBackClick && (
          <button className="navbarContainer-back-button" onClick={onBackClick}>
            {"<"}
          </button>
        )}
        <h1 className="navbarContainer-title">{title}</h1>
        {isAuthenticated && (
          <button
            className="navbarContainer-logout-button"
            onClick={handleLogout}
          >
            {t("logout")}
          </button>
        )}
      </header>
      <main className="contentContainer">{children}</main>
    </div>
  )
}

export default Layout
