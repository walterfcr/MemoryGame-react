import { useRef, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAudio } from "../context/AudioContext"
import { gsap } from "gsap"
import { useTranslation } from "react-i18next"
import Layout from "../components/Layout"
import "./WelcomePage.css"

const CHARACTER_IMAGES = [
  "/images/logo.png", 
  "/images/preview-card1.webp",  
  "/images/preview-card2.webp",    
  "/images/preview-card3.webp",  
  "/images/preview-card4.webp", 
  "/images/logo.png", 
  "/images/preview-card5.webp",  
  "/images/preview-card6.webp",    
  "/images/preview-card7.webp",  
  "/images/preview-card8.webp", 
];

const WelcomePage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  
  const { welcomeSoundtrack } = useAudio()
  
  const containerRef = useRef(null)
  const cardFrameRef = useRef(null) 
  const characterRef = useRef(null) 
  const overlayRef = useRef(null)   

  const clickSound = useRef(new Audio("/sounds/click.wav"))
  
  const [currentImgIndex, setCurrentImgIndex] = useState(0)

  // block interaction until the user enables audio playback
  const [hasInteracted, setHasInteracted] = useState(false)

  // browsers require user interaction before playing audio
  const handleEnterGame = () => {
    setHasInteracted(true);

    if (welcomeSoundtrack && welcomeSoundtrack.current) {
      welcomeSoundtrack.current.loop = true
      welcomeSoundtrack.current.volume = 1
      welcomeSoundtrack.current.play().catch((err) => console.log("Audio play failed:", err))
    }

    // fade out intro overlay before revealing the main content
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        gsap.fromTo(containerRef.current, 
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" }
        )
      }
    })
  }

  useEffect(() => {
    const floatingAnimation = gsap.to(cardFrameRef.current, {
      boxShadow: "0 0 35px rgba(141, 191, 255, 0.6)",
      scale: 1.02,
      y: -12,
      duration: 1.5,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
    })

    // continuously rotate preview images with a fade transition
    const characterTimeline = setInterval(() => {
      gsap.to(characterRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power1.inOut",
        onComplete: () => {
          setCurrentImgIndex((prevIndex) => (prevIndex + 1) % CHARACTER_IMAGES.length)
          
          gsap.to(characterRef.current, {
            opacity: 1,
            duration: 0.4,
            ease: "power1.inOut",
          })
        },
      })
    }, 4000)

    // cleanup animations and intervals on component unmount
    return () => {
      clearInterval(characterTimeline)
      floatingAnimation.kill()
    }
  }, [])

  const handleStart = () => {
    if (clickSound.current) {
      clickSound.current.currentTime = 0
      clickSound.current.play()
    }
    
    if (welcomeSoundtrack && welcomeSoundtrack.current) {
      gsap.to(welcomeSoundtrack.current, {
        volume: 0,
        duration: 0.4,
        ease: "power1.inOut"
      })
    }

    // fade soundtrack out smoothly before navigation
    gsap.to(containerRef.current, {
      opacity: 0,
      y: -50,
      duration: 0.4,
      ease: "power2.inOut",
      onComplete: () => navigate("/menu"),
    })
  }

  return (
    <Layout title={t("memoryGame")} onBackClick={null}>
      
      {!hasInteracted && (
        <div className="audioUnlockOverlay" ref={overlayRef} onClick={handleEnterGame}>
          <div className="pulsingPrompt">
            <h2>CLICK ANYWHERE TO START</h2>
            <p>TAP SCREEN FOR SOUND</p>
          </div>
        </div>
      )}

      <div 
        className="welcomePageContainer" 
        ref={containerRef} 
        style={{ opacity: 0 }}
      >
        <div className="heroSection">
          <p className="gameDescription">
            {t("gameDescriptionText")}
          </p>
        </div>

        <div className="gamePreviewContainer">
          <div className="previewCardFrame" ref={cardFrameRef}>
            <img 
              ref={characterRef} 
              src={CHARACTER_IMAGES[currentImgIndex]} 
              alt="Character Preview" 
              className="characterImage" 
            />
          </div>
        </div>

        <button onClick={handleStart} className="hugePlayButton">
          {t("pressToStart")}
        </button>

      </div>
    </Layout>
  );
};

export default WelcomePage