'use client'

import { useState, useEffect } from 'react'
import MemoryGame from '../components/MemoryGame'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'

function EnhancedMemoryGameUpdated({
  category: initialCategory,
  difficulty: initialDifficulty,
}) {
  const { t } = useTranslation()
  const { user, isAuthenticated } = useAuth()

  const [currentCategory, setCurrentCategory] = useState(
    initialCategory || localStorage.getItem('selectedCategory') || 'musicians',
  )

  const [currentDifficulty, setCurrentDifficulty] = useState(
    initialDifficulty || localStorage.getItem('selectedDifficulty') || 'Easy',
  )

  // sync local state when route props change
  useEffect(() => {
    setCurrentCategory(
      initialCategory ||
        localStorage.getItem('selectedCategory') ||
        'musicians',
    )
    setCurrentDifficulty(
      initialDifficulty || localStorage.getItem('selectedDifficulty') || 'Easy',
    )
  }, [initialCategory, initialDifficulty])

  const finalPlayerName =
    isAuthenticated && user
      ? user.displayName || user.email?.split('@')[0]
      : t('guest')

  return (
    <MemoryGame
      category={currentCategory}
      difficulty={currentDifficulty}
      playerName={finalPlayerName}
    />
  )
}

export default EnhancedMemoryGameUpdated
