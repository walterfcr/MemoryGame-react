import { useEffect, useRef } from 'react'

export const useAudioEffects = (isMuted) => {
  const flipSound = useRef(new Audio('/sounds/flip.mp3'))
  const winSound = useRef(new Audio('/sounds/win.mp3'))
  const clickSound = useRef(new Audio('/sounds/click.wav'))
  const matchSound = useRef(new Audio('/sounds/match-sound.mp3'))
  const backgroundMusic = useRef(new Audio('/sounds/play.mp3'))

  // shared audio playback handler with mute protection
  const playSound = (audioRef) => {
    if (isMuted || !audioRef.current) return

    audioRef.current.currentTime = 0
    audioRef.current.play()
  }

  // start and cleanup looping background music
  useEffect(() => {
    const music = backgroundMusic.current

    if (!music) return

    music.loop = true
    music.muted = isMuted
    music.currentTime = 0

    music.play().catch(() => {})

    return () => {
      music.pause()
      music.currentTime = 0
    }
  }, [isMuted])

  return {
    playFlip: () => playSound(flipSound),
    playMatch: () => playSound(matchSound),
    playWin: () => playSound(winSound),
    playClick: () => playSound(clickSound),
  }
}
