import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAudio } from "../context/AudioContext"; // ✅ Hooks into central control tower
import { gsap } from "gsap";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import "./WelcomePage.css";

// Array of character images (transparent PNGs/WebPs)
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
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // ✅ Fetching the persistent welcome sound from central audio context control tower
  const { welcomeSoundtrack } = useAudio();
  
  // DOM References
  const containerRef = useRef(null);
  const cardFrameRef = useRef(null);   
  const characterRef = useRef(null);   
  const overlayRef = useRef(null);     

  // Sound Effects References
  const clickSound = useRef(new Audio("/sounds/click.wav"));
  
  // Component State
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Unlocks browser audio context smoothly when player triggers the overlay
  const handleEnterGame = () => {
    setHasInteracted(true);

    if (welcomeSoundtrack && welcomeSoundtrack.current) {
      welcomeSoundtrack.current.loop = true;
      welcomeSoundtrack.current.volume = 1;
      welcomeSoundtrack.current.play().catch((err) => console.log("Audio play failed:", err));
    }

    // Smoothly fade out the initial overlay screen
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        // Reveal main screen elements nicely
        gsap.fromTo(containerRef.current, 
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" }
        );
      }
    });
  };

  useEffect(() => {
    // 1. Continuous card hover float and neon pulse loop
    const floatingAnimation = gsap.to(cardFrameRef.current, {
      boxShadow: "0 0 35px rgba(141, 191, 255, 0.6)",
      scale: 1.02,
      y: -12,
      duration: 1.5,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
    });

    // 2. Continuous smooth crossfade carousel for character art inside the card frame
    const characterTimeline = setInterval(() => {
      gsap.to(characterRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power1.inOut",
        onComplete: () => {
          setCurrentImgIndex((prevIndex) => (prevIndex + 1) % CHARACTER_IMAGES.length);
          
          gsap.to(characterRef.current, {
            opacity: 1,
            duration: 0.4,
            ease: "power1.inOut",
          });
        },
      });
    }, 4000);

    // Clean up timers and loops when leaving page
    return () => {
      clearInterval(characterTimeline);
      floatingAnimation.kill();
    };
  }, []);

  // Action to smoothly transition user into the main menu dashboard
  const handleStart = () => {
    if (clickSound.current) {
      clickSound.current.currentTime = 0;
      clickSound.current.play();
    }
    
    // Fade out the looping welcome track volume along with exit animation
    if (welcomeSoundtrack && welcomeSoundtrack.current) {
      gsap.to(welcomeSoundtrack.current, {
        volume: 0,
        duration: 0.4,
        ease: "power1.inOut"
      });
    }

    gsap.to(containerRef.current, {
      opacity: 0,
      y: -50,
      duration: 0.4,
      ease: "power2.inOut",
      onComplete: () => navigate("/menu"),
    });
  };

  return (
    <Layout title={t("memoryGame")} onBackClick={null}>
      
      {/* 1. THE AUDIO OVERLAY: Blocks view until clicked to satisfy browser safety parameters */}
      {!hasInteracted && (
        <div className="audioUnlockOverlay" ref={overlayRef} onClick={handleEnterGame}>
          <div className="pulsingPrompt">
            <h2>CLICK ANYWHERE TO START</h2>
            <p>TAP SCREEN FOR SOUND</p>
          </div>
        </div>
      )}

      {/* 2. THE MAIN LANDING CONTENT CONTAINER */}
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

        {/* Visual Card Showcase Display */}
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

        {/* Start Action Call-to-Action */}
        <button onClick={handleStart} className="hugePlayButton">
          {t("pressToStart")}
        </button>

      </div>
    </Layout>
  );
};

export default WelcomePage;