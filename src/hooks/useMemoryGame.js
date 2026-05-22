import { useState, useEffect, useCallback } from "react"
import { generateCards } from "../utils/generateCards"

export const useMemoryGame = (category, difficulty) => {
  const [cards, setCards] = useState([])
  const [flippedCards, setFlippedCards] = useState([])
  const [gameWon, setGameWon] = useState(false)
  const [time, setTime] = useState(0)
  const [clickCount, setClickCount] = useState(0)
  const [score, setScore] = useState(0)
  const [scoreSaved, setScoreSaved] = useState(false)

  const resetGame = useCallback(() => {
    setCards(generateCards(category, difficulty))
    setFlippedCards([])
    setGameWon(false)
    setTime(0)
    setClickCount(0)
    setScore(0)
    setScoreSaved(false)
  }, [category, difficulty])

  useEffect(() => {
    resetGame()
  }, [resetGame])

  useEffect(() => {
    if (gameWon) return

    const timer = setInterval(() => {
      setTime((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [gameWon])

  const handleCardClick = (index, onMoveCount, playFlip, playMatch) => {
    if (
        flippedCards.length === 2 ||
        cards[index].flipped ||
        cards[index].matched
    ) {
        return
    }

    const newClicks = clickCount + 1
    setClickCount(newClicks)

    if (onMoveCount) {
        onMoveCount(newClicks)
    }

    const updated = [...cards]
    updated[index].flipped = true
    setCards(updated)

    playFlip()

    const newFlipped = [...flippedCards, index]
    setFlippedCards(newFlipped)

    if (newFlipped.length === 2) {
        const [a, b] = newFlipped

        setTimeout(() => {
        if (updated[a].image === updated[b].image) {
            updated[a].matched = true
            updated[b].matched = true

            updated[a].highlight = true
            updated[b].highlight = true

            playMatch()

            setCards([...updated])

            setTimeout(() => {
            updated[a].highlight = false
            updated[b].highlight = false

            setCards([...updated])
            }, 600)
        } else {
            updated[a].flipped = false
            updated[b].flipped = false

            setCards([...updated])
        }

        setFlippedCards([])
        }, 700)
      }
    }

  return {
    cards,
    setCards,
    flippedCards,
    setFlippedCards,
    gameWon,
    setGameWon,
    time,
    setTime,
    clickCount,
    setClickCount,
    score,
    setScore,
    scoreSaved,
    setScoreSaved,
    resetGame,
    handleCardClick,
  }
}