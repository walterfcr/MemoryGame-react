"use client"

import { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import Layout from "./Layout"
import "./Leaderboard.css"
import { useAuth } from "../context/AuthContext"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"
import { db } from "../firebase"

const Leaderboard = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()

  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)

  const clickSound = useRef(new Audio("/sounds/click.wav"))

  const playClickSound = () => {
    clickSound.current.currentTime = 0
    clickSound.current.play()
  }

  const handleBack = () => {
    playClickSound()
    navigate("/")
  }

  const loadScores = async () => {
    setLoading(true)
    try {
      const q = query(
        collection(db, "scores"),
        orderBy("score", "desc"),
        limit(15)
      )

      const snapshot = await getDocs(q)

      const scoresData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      setScores(scoresData)
    } catch (error) {
      console.error("❌ Error loading scores:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadScores()
  }, [])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getRankEmoji = (index) => {
    if (index === 0) return "🥇"
    if (index === 1) return "🥈"
    if (index === 2) return "🥉"
    return `#${index + 1}`
  }

  return (
    <Layout title={t("leaderboard")} onBackClick={handleBack}>
      <div className="leaderboard-container">
        {loading ? (
          <p>🔄 Loading scores...</p>
        ) : scores.length === 0 ? (
          <p>🎯 {t("noScoresFound")}</p>
        ) : (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>{t("rank")}</th>
                <th>{t("player")}</th>
                <th>{t("category")}</th>
                <th>{t("difficulty")}</th>
                <th>{t("time")}</th>
                <th>{t("clicks")}</th>
                <th>{t("score")}</th>
              </tr>
            </thead>

            <tbody>
              {scores.map((score, index) => (
                <tr key={score.id}>
                  <td>{getRankEmoji(index)}</td>

                  <td>
                    {score.playerName}
                    {isAuthenticated && user?.username === score.playerName && " (You)"}
                  </td>

                  <td>{score.category}</td>
                  <td>{score.difficulty}</td>
                  <td>{formatTime(score.time)}</td>
                  <td>{score.clicks}</td>
                  <td>{score.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  )
}

export default Leaderboard