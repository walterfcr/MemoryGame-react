"use client"

import { Routes, Route } from "react-router-dom"
import StartPage from "./components/StartPage"
import DifficultySelector from "./components/DifficultySelector"
import CategorySelector from "./components/CategorySelector"
import ScoreBoard from "./components/ScoreBoard"
import LanguageSelector from "./components/LanguageSelector"
import Credits from "./components/Credits"
import Login from "./components/Login"
import EnhancedMemoryGameUpdated from "./components/EnhancedMemoryGameUpdated"
import Leaderboard from "./components/Leaderboard"
import "./index.css"

function App() {
  // ELIMINA ESTOS ESTADOS:
  // const [selectedCategory, setSelectedCategory] = useState('musicians');
  // const [selectedDifficulty, setSelectedDifficulty] = useState('easy');

  // Si necesitas un placeholder para las funciones setCategory/setDifficulty
  // que se pasan a los selectores, puedes usar funciones vacías o un estado dummy.
  // Sin embargo, si los selectores ahora guardan en localStorage y navegan,
  // quizás ya no necesites pasarles estas funciones desde App.jsx.
  // Para simplificar, asumiremos que los selectores ahora manejan su propia navegación
  // y guardado en localStorage.

  return (
    <div className="mainContainer">
      {/* <TestConnection /> */} {/* Commented out - keep for testing later */}
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/login" element={<Login />} />
        {/* Pasa funciones dummy o elimina la prop si los selectores no la necesitan */}
        <Route path="/difficulty" element={<DifficultySelector />} />
        <Route path="/categories" element={<CategorySelector />} />
        <Route path="/score" element={<ScoreBoard />} />
        <Route path="/Leaderboard" element={<Leaderboard />} />
        <Route path="/language" element={<LanguageSelector />} />
        <Route path="/credits" element={<Credits />} />
        {/* ¡IMPORTANTE! Ya no pases las props category y difficulty aquí */}
        <Route path="/play" element={<EnhancedMemoryGameUpdated />} />
      </Routes>
    </div>
  )
}

export default App
