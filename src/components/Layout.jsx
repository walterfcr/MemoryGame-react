'use client'

import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { useAudio } from '../context/AudioContext'

const Layout = ({ children, title, onBackClick }) => {
  const { t } = useTranslation()
  const { isAuthenticated, logout } = useAuth()
  const { isMuted, setIsMuted } = useAudio()

  const clickSound = useRef(new Audio('/sounds/click.wav'))

  // prevent click sounds while muted
  const playClickSound = () => {
    if (clickSound.current && !isMuted) {
      clickSound.current.currentTime = 0
      clickSound.current.play()
    }
  }

  const handleLogout = () => {
    playClickSound()
    logout()
  }

  const toggleMute = () => {
    const nextMuteState = !isMuted
    setIsMuted(nextMuteState)

    // only play feedback sound when enabling audio
    if (!nextMuteState && clickSound.current) {
      clickSound.current.currentTime = 0
      clickSound.current.play()
    }
  }

  return (
    <div className="mainContainer">
      <header className="navbarContainer">
        {onBackClick && (
          <button
            className="navbarContainer-back-button"
            onClick={() => {
              playClickSound()
              onBackClick()
            }}
          >
            {'<'}
          </button>
        )}

        <h1 className="navbarContainer-title">{title}</h1>

        <div
          className="navbarContainer-actions"
          style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}
        >
          <button
            className={`navbarContainer-mute-button ${isMuted ? 'muted' : ''}`}
            onClick={toggleMute}
            aria-label="Toggle Sound"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>

          {isAuthenticated && (
            <button
              className="navbarContainer-logout-button"
              onClick={handleLogout}
            >
              {t('logout')}
            </button>
          )}
        </div>
      </header>

      <main className="contentContainer">{children}</main>
    </div>
  )
}

export default Layout
