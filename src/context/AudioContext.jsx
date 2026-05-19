import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
  const location = useLocation();
  
  // 1. Core global state for managing muting preferences
  const [isMuted, setIsMuted] = useState(() => {
    // Persistent memory: stays muted even if the page is refreshed!
    return localStorage.getItem("gameMuted") === "true";
  });

  const menuSoundtrack = useRef(new Audio("/sounds/soundtrack.mp3"));
  const welcomeSoundtrack = useRef(new Audio("/sounds/welcomePage.mp3"));

  // 2. Whenever muting state changes, update the volume settings instantly
  useEffect(() => {
    menuSoundtrack.current.muted = isMuted;
    welcomeSoundtrack.current.muted = isMuted;
    localStorage.setItem("gameMuted", isMuted);
  }, [isMuted]);

  useEffect(() => {
    menuSoundtrack.current.loop = true;
    welcomeSoundtrack.current.loop = true;

    // Synchronize current muting flags on path updates
    menuSoundtrack.current.muted = isMuted;
    welcomeSoundtrack.current.muted = isMuted;

    const currentPath = location.pathname.toLowerCase();

    if (currentPath === "/play") {
      menuSoundtrack.current.pause();
      welcomeSoundtrack.current.pause();
    }
    else if (currentPath === "/" || currentPath === "") {
      menuSoundtrack.current.pause();
      welcomeSoundtrack.current.play().catch(() => {});
    }
    else {
      welcomeSoundtrack.current.pause();
      if (menuSoundtrack.current.paused) {
        menuSoundtrack.current.currentTime = 0;
      }
      menuSoundtrack.current.play().catch(() => {});
    }
  }, [location, isMuted]); // Keeps routing and mute states fully unified

  return (
    <AudioContext.Provider value={{ menuSoundtrack, welcomeSoundtrack, isMuted, setIsMuted }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);