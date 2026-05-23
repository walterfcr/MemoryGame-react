import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { gsap } from 'gsap'
import { useTranslation } from 'react-i18next'
import './Credits.css'

export function Credits() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const clickSound = useRef(new Audio('/sounds/click.wav'))

  // animate page entrance on mount
  useEffect(() => {
    gsap.from(containerRef.current, {
      x: '100vw',
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
    })
  }, [])

  const handleBack = () => {
    clickSound.current.currentTime = 0
    clickSound.current.play()
    navigate('/menu')
  }

  return (
    <Layout title={t('credits')} onBackClick={handleBack}>
      <div ref={containerRef} className="creditsContent">
        <h1>{t('credits')}</h1>

        <img
          src="/images/credits-logo.png"
          alt="Credits Logo"
          className="logoImageCredits"
        />

        <div className="creditsWrapper">
          <div className="creditGroup">
            <span className="creditLabel">Project</span>
            <p className="creditValue">{t('project')}</p>
          </div>

          <div className="creditGroup">
            <span className="creditLabel">Inspired by</span>
            <p className="creditValue">{t('inspired')}</p>
          </div>

          <div className="creditGroup">
            <span className="creditLabel">Developed by</span>
            <p className="creditValue">{t('developed')}</p>
          </div>

          <div className="creditGroup">
            <span className="creditLabel">Version</span>
            <p className="creditValue">{t('version')}</p>
          </div>

          <div className="creditGroup creditFooterText">
            <p>{t('built')}</p>
            <p>{t('sound')}</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Credits
