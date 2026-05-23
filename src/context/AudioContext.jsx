import { createContext, useContext, useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
  const location = useLocation();
  
  // persist mute preference across sessions
  const [isMuted, setIsMuted] = useState(() => {
  
    return localStorage.getItem("gameMuted") === "true"
  });

  // persistent audio instances shared across the application
  const menuSoundtrack = useRef(new Audio("/sounds/soundtrack.mp3"))
  const welcomeSoundtrack = useRef(new Audio("/sounds/welcomePage.mp3"))

  // sync mute state with active audio tracks and localStorage
  useEffect(() => {
    menuSoundtrack.current.muted = isMuted
    welcomeSoundtrack.current.muted = isMuted
    localStorage.setItem("gameMuted", isMuted)
  }, [isMuted])

  // control soundtrack playback based on current route
  useEffect(() => {
    menuSoundtrack.current.loop = true;
    welcomeSoundtrack.current.loop = true;

    menuSoundtrack.current.muted = isMuted;
    welcomeSoundtrack.current.muted = isMuted;

    const currentPath = location.pathname.toLowerCase();

    // disable menu music during gameplay
    if (currentPath === "/play") {
      menuSoundtrack.current.pause()
      welcomeSoundtrack.current.pause()
    }
    // play landing page soundtrack on home screen
    else if (currentPath === "/" || currentPath === "") {
      menuSoundtrack.current.pause()
      welcomeSoundtrack.current.play().catch(() => {})
    }
    else {
      welcomeSoundtrack.current.pause()
      // restart soundtrack when re-entering menu routes
      if (menuSoundtrack.current.paused) {
        menuSoundtrack.current.currentTime = 0
      }
      menuSoundtrack.current.play().catch(() => {})
    }
  }, [location, isMuted]); 

  return (
    <AudioContext.Provider value={{ menuSoundtrack, welcomeSoundtrack, isMuted, setIsMuted }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);