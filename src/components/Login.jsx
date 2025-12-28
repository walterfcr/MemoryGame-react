import { useState, useRef } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import Layout from "./Layout"
import { useTranslation } from "react-i18next"
import "./Login.css"

function Login() {
  const { t } = useTranslation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [formError, setFormError] = useState(null)

  const { login, loading } = useAuth()
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
    setFormError(null)

    if (!email || !password) {
      setFormError(t("allFieldsRequired"))
      return
    }

    if (!validateEmail(email)) {
      setFormError(t("invalidEmailFormat"))
      return
    }

    const result = await login(email, password)

    if (!result || !result.success) {
      setFormError(t(result?.error) || t("loginFailed"))
    } else {
      navigate("/") // ✅ CHANGE ROUTE HERE IF NEEDED ("/play", "/menu", etc.)
    }
  }

  const handleBack = () => {
    playClickSound()
    navigate("/")
  }

  return (
    <Layout title={t("login")} onBackClick={handleBack}>
      <div className="auth-container">
        <h1>{t("login")}</h1>

        <img
          src="/images/login-logo.png"
          alt="Login Logo"
          className="logoImage"
        />

        <form onSubmit={handleSubmit} className="auth-form">
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

          {formError && (
            <p className="auth-error-message">{formError}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="auth-button"
          >
            {loading ? t("loggingIn") : t("login")}
          </button>
        </form>

        <p className="auth-switch-text">
          {t("noAccount")}{" "}
          <span
            onClick={() => {
              playClickSound()
              navigate("/register")
            }}
            className="auth-switch-link"
          >
            {t("registerHere")}
          </span>
        </p>
      </div>
    </Layout>
  )
}

export default Login
