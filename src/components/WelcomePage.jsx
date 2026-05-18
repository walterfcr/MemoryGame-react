import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { useTranslation } from "react-i18next";
import Layout from "./Layout";
import "./WelcomePage.css";

// 1. Array of ONLY the character images (transparent PNGs)
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
  const containerRef = useRef(null);
  
  const cardFrameRef = useRef(null);   // Ref for the entire card box
  const characterRef = useRef(null);   // Ref for ONLY the character inside
  
  const clickSound = useRef(new Audio("/sounds/click.wav"));
  const welcomeSound = useRef(new Audio("/sounds/welcomePage.wav"));
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    // Play welcome sound on load (looping)
    if (welcomeSound.current) {
      welcomeSound.current.loop = true;
      welcomeSound.current.currentTime = 0;
      welcomeSound.current.play().catch(() => {});
    }

    // Reveal page layout
    gsap.from(containerRef.current, {
      opacity: 0,
      scale: 0.95,
      duration: 0.6,
      ease: "power3.out",
    });

    // 2. Continuous hover and neon pulse applied to the ENTIRE card frame
    gsap.to(cardFrameRef.current, {
      boxShadow: "0 0 35px rgba(141, 191, 255, 0.6)",
      scale: 1.02,
      y: -12,
      duration: 1.5,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
    });

    // 3. Smooth crossfade interval applied ONLY to the character artwork
    const characterTimeline = setInterval(() => {
      // Fade out the current character smoothly
      gsap.to(characterRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power1.inOut",
        onComplete: () => {
          // Change the source image while invisible
          setCurrentImgIndex((prevIndex) => (prevIndex + 1) % CHARACTER_IMAGES.length);
          
          // Fade the new character back in
          gsap.to(characterRef.current, {
            opacity: 1,
            duration: 0.4,
            ease: "power1.inOut",
          });
        },
      });
    }, 4000); // Swaps characters every 4 seconds

    return () => {
      clearInterval(characterTimeline);
      // Stop welcome sound when leaving the page
      if (welcomeSound.current) {
        welcomeSound.current.pause();
        welcomeSound.current.currentTime = 0;
      }
    };
  }, []);

  const handleStart = () => {
    if (clickSound.current) {
      clickSound.current.currentTime = 0;
      clickSound.current.play();
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
      <div className="welcomePageContainer" ref={containerRef}>
        
        <div className="heroSection">
          <p className="gameDescription">
            {t("gameDescriptionText")}
          </p>
        </div>

        {/* Visual Preview Section */}
        <div className="gamePreviewContainer">
          
          {/* THE CARD FRAME: This holds the background color and rounded corners */}
          <div className="previewCardFrame" ref={cardFrameRef}>
            
            {/* THE CHARACTER: This is the only thing that fades out and changes */}
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

export default WelcomePage;
