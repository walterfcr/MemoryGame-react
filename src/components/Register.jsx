"use client"

import { useState, useRef } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import Layout from "./Layout"
import { useTranslation } from "react-i18next"
import "./Login.css"

function Register() {
  const { t } = useTranslation()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [formError, setFormError] = useState(null)
  const { register, loading } = useAuth()
  const navigate = useNavigate()

  const clickSound = useRef(new Audio("/sounds/click.wav"))
  const playClickSound = () => {
    if (clickSound.current) {
      clickSound.current.currentTime = 0
      clickSound.current.play()
    }
  }

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    playClickSound()
    setFormError(null) // Limpiar errores anteriores

    // Validaciones del lado del cliente
    if (!username || !email || !password || !confirmPassword) {
      setFormError(t("allFieldsRequired"))
      return
    }

    if (!validateEmail(email)) {
      setFormError(t("invalidEmailFormat"))
      return
    }

    if (username.length < 3) {
      setFormError(t("usernameTooShort"))
      return
    }

    if (username.length > 30) {
      setFormError(t("usernameTooLong"))
      return
    }

    if (password.length < 6) {
      setFormError(t("passwordTooShort"))
      return
    }

    if (password !== confirmPassword) {
      setFormError(t("passwordsDoNotMatch"))
      return
    }

    const result = await register(username, email, password)
    if (!result.success) {
      // Usar el error específico del backend si existe, de lo contrario, un genérico
      setFormError(t(result.error) || t("registrationFailed"))
    }
  }

  const handleBack = () => {
    playClickSound()
    navigate("/")
  }

  return (
    <Layout title={t("register")} onBackClick={handleBack}>
      <div className="auth-container logoReg">
        <h1>{t("register")}</h1>
        <img src="/images/logo-reg.webp" alt="Logo" />
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label htmlFor="username" className="input-label">
              {t("username")}:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t("yourUsername")}
              className="auth-input"
              disabled={loading}
            />
          </div>
          <div className="input-group">
            <label htmlFor="email" className="input-label">
              {t("email")}:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("yourEmail")}
              className="auth-input"
              disabled={loading}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password" className="input-label">
              {t("password")}:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("yourPassword")}
              className="auth-input"
              disabled={loading}
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirmPassword" className="input-label">
              {t("confirmPassword")}:
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t("confirmYourPassword")}
              className="auth-input"
              disabled={loading}
            />
          </div>

          {formError && <p className="auth-error-message">{formError}</p>}

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? t("registering") : t("register")}
          </button>
        </form>
        <p className="auth-switch-text">
          {t("alreadyHaveAccount")}?{" "}
          <span onClick={() => navigate("/login")} className="auth-switch-link">
            {t("loginHere")}
          </span>
        </p>
      </div>
    </Layout>
  )
}

export default Register
