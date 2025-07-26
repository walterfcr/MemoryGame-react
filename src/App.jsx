"use client"

import { Routes, Route } from "react-router-dom"
import StartPage from "./components/StartPage"
import DifficultySelector from "./components/DifficultySelector"
import CategorySelector from "./components/CategorySelector"
import ScoreBoard from "./components/ScoreBoard" // Aunque no se usa directamente, lo mantengo
import LanguageSelector from "./components/LanguageSelector"
import Credits from "./components/Credits"
import Login from "./components/Login"
import Register from "./components/Register"
import EnhancedMemoryGameUpdated from "./components/EnhancedMemoryGameUpdated"
import Leaderboard from "./components/Leaderboard"
import { AuthProvider } from "./context/AuthContext"
import PlayerNameEntry from "./components/PlayerNameEntry"
import ProtectedRoute from "./components/ProtectedRoute" // NUEVO: Importa ProtectedRoute
import "./index.css"

function App() {
  return (
    <div className="mainContainer">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/difficulty" element={<DifficultySelector />} />
          <Route path="/categories" element={<CategorySelector />} />
          <Route path="/score" element={<ScoreBoard />} /> {/* Esta ruta no se usa, pero se mantiene */}
          <Route path="/language" element={<LanguageSelector />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="/player-name-entry" element={<PlayerNameEntry />} />

          {/* Rutas Protegidas */}
          <Route
            path="/play"
            element={
              <ProtectedRoute>
                <EnhancedMemoryGameUpdated />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Leaderboard"
            element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            }
          />
          {/* Puedes añadir más rutas protegidas aquí */}
        </Routes>
      </AuthProvider>
    </div>
  )
}

export default App
