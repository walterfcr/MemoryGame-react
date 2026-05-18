import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { useTranslation } from "react-i18next";
import Layout from "./Layout";
import "./WelcomePage.css";

// Array of character images (transparent PNGs/WebPs)
const CHARACTER_IMAGES = [
  "/images/logo.png", 
  "/images/preview-card1.webp",  
  "/images/preview-card2.webp",    
  "/images/preview-card3.webp",  
  "/images/preview-card4.webp", 
];

const WelcomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // DOM References
  const containerRef = useRef(null);
  const cardFrameRef = useRef(null);   
  const characterRef = useRef(null);   
  const overlayRef = useRef(null);     

  // Sound Effects References
  const clickSound = useRef(new Audio("/sounds/click.wav"));
  const welcomeSound = useRef(new Audio("/sounds/welcomePage.wav"));
  
  // Component State
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Unlocks the browser audio context immediately when the user taps the initial overlay
  const handleEnterGame = () => {
    setHasInteracted(true);

    if (welcomeSound.current) {
      welcomeSound.current.loop = true;
      welcomeSound.current.volume = 1;
      welcomeSound.current.play().catch((err) => console.log("Audio play failed:", err));
    }

    // Smoothly fade out the initial splash overlay screen
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        // Trigger your elegant main content reveal animation once the overlay vanishes
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
      // Step A: Fade character out smoothly
      gsap.to(characterRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power1.inOut",
        onComplete: () => {
          // Step B: Swap the source image file behind the scenes while invisible
          setCurrentImgIndex((prevIndex) => (prevIndex + 1) % CHARACTER_IMAGES.length);
          
          // Step C: Fade new character back into view
          gsap.to(characterRef.current, {
            opacity: 1,
            duration: 0.4,
            ease: "power1.inOut",
          });
        },
      });
    }, 4000); // Cycles artwork every 4 seconds

    // Clean up timers and animations when navigating away from this component
    return () => {
      clearInterval(characterTimeline);
      floatingAnimation.kill();
      
      if (welcomeSound.current) {
        welcomeSound.current.pause();
        welcomeSound.current.currentTime = 0;
      }
    };
  }, []);

  // Action to smoothly route user into the main menu dashboard
  const handleStart = () => {
    if (clickSound.current) {
      clickSound.current.currentTime = 0;
      clickSound.current.play();
    }
    
    // Fade out the looping welcome track volume alongside the container exit transition
    if (welcomeSound.current) {
      gsap.to(welcomeSound.current, {
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
      
      {/* 1. THE AUDIOWALL OVERLAY: Blocks layout view until clicked to satisfy browser security */}
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
        style={{ opacity: hasInteracted ? 1 : 0 }} // Hidden initially until user interacts
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