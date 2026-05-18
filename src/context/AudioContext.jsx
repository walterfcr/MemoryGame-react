import { createContext, useContext, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
  const location = useLocation();

  // Create persistent single instances of your background music files
  const menuSoundtrack = useRef(new Audio("/sounds/soundtrack.mp3"));
  const welcomeSoundtrack = useRef(new Audio("/sounds/welcomePage.wav"));

  useEffect(() => {
    // Basic setup configurations
    menuSoundtrack.current.loop = true;
    welcomeSoundtrack.current.loop = true;

    const currentPath = location.pathname.toLowerCase();

    // 1. SCENARIO A: The user is actively playing the Memory Game grid
    if (currentPath === "/play") {
      menuSoundtrack.current.pause();
      welcomeSoundtrack.current.pause();
    }
    // 2. SCENARIO B: The user is resting on the absolute frontend Welcome screen
    else if (currentPath === "/" || currentPath === "") {
      menuSoundtrack.current.pause();
      // Only trigger if audio context has already been unlocked by user click
      welcomeSoundtrack.current.play().catch(() => {});
    }
    // 3. SCENARIO C: The user is browsing the sub-menus (Difficulty, Credits, Leaderboards...)
    else {
      welcomeSoundtrack.current.pause();
      // Seamlessly keep looping the default menu music
      menuSoundtrack.current.play().catch(() => {});
    }
  }, [location]); // Triggers auto-evaluation smoothly on every single URL change

  // Provide manual access parameters so pages can manually stop/fade music if needed
  return (
    <AudioContext.Provider value={{ menuSoundtrack, welcomeSoundtrack }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);