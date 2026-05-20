"use client"

import { Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { AudioProvider } from "./context/AudioContext"
import WelcomePage from "./pages/WelcomePage"
import StartPage from "./pages/StartPage"
import DifficultySelector from "./pages/DifficultySelector"
import CategorySelector from "./pages/CategorySelector"
import ScoreBoard from "./pages/ScoreBoard"
import LanguageSelector from "./pages/LanguageSelector"
import Credits from "./pages/Credits"
import Login from "./pages/Login"
import Register from "./pages/Register"
import EnhancedMemoryGameUpdated from "./pages/EnhancedMemoryGameUpdated"
import Leaderboard from "./pages/Leaderboard"
import Profile from "./pages/Profile"
import GameCompleteWrapper from "./components/GameCompleteWrapper" 
import PlayerNameEntry from "./components/PlayerNameEntry"
import ProtectedRoute from "./components/ProtectedRoute"
import "./index.css"

function App() {
  return (
    <div className="mainContainer">
      <AuthProvider>
        <AudioProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<WelcomePage />} />
          <Route path="/menu" element={<StartPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/difficulty" element={<DifficultySelector />} />
          <Route path="/categories" element={<CategorySelector />} />
          <Route path="/score" element={<ScoreBoard />} />
          <Route path="/language" element={<LanguageSelector />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="/player-name-entry" element={<PlayerNameEntry />} />

          {/* Protected Routes */}
          <Route
            path="/play"
            element={
              <ProtectedRoute>
                <EnhancedMemoryGameUpdated />
              </ProtectedRoute>
            }
          />

          {/* ✅ THIS FIXES YOUR ERROR */}
          <Route
            path="/game-complete"
            element={
              <ProtectedRoute>
                <GameCompleteWrapper />
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

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
        </AudioProvider>
      </AuthProvider>
    </div>
  )
}

export default App