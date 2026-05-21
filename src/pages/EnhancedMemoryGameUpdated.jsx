"use client"

import { useState, useEffect } from "react"
import MemoryGame from "../components/MemoryGame"
import { useAuth } from "../context/AuthContext"
import { useTranslation } from "react-i18next"

function EnhancedMemoryGameUpdated({ category: initialCategory, difficulty: initialDifficulty }) {
  const { t } = useTranslation()
  const { user, isAuthenticated } = useAuth()

  const [currentCategory, setCurrentCategory] = useState(
    initialCategory || localStorage.getItem("selectedCategory") || "musicians"
  )

  const [currentDifficulty, setCurrentDifficulty] = useState(
    initialDifficulty || localStorage.getItem("selectedDifficulty") || "Easy"
  )

  // Sync props with state if they change externally
  useEffect(() => {
    setCurrentCategory(initialCategory || localStorage.getItem("selectedCategory") || "musicians")
    setCurrentDifficulty(initialDifficulty || localStorage.getItem("selectedDifficulty") || "Easy")
  }, [initialCategory, initialDifficulty])

  // Determine the display name safely from Firebase Auth profile data
  // Fallbacks: Firebase displayName ➡️ email prefix ➡️ Guest localization string
  const finalPlayerName = isAuthenticated && user
    ? (user.displayName || user.email?.split("@")[0])
    : t("guest")

  // ✅ NO MORE CHOKEPING STEPS! Jump directly to rendering the match board matrix.
  return (
    <MemoryGame
      category={currentCategory}
      difficulty={currentDifficulty}
      playerName={finalPlayerName}
    />
  )
}

export default EnhancedMemoryGameUpdated