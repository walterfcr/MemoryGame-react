"use client"

import { createContext, useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getProfile, loginUser, registerUser } from "./authService" // Assuming these functions are defined in authService

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Cargar token y usuario desde localStorage al inicio
  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      setToken(storedToken)
      // Intentar obtener el perfil del usuario para validar el token
      const fetchUser = async () => {
        try {
          const userData = await getProfile(storedToken)
          setUser(userData)
        } catch (err) {
          console.error("Failed to fetch user profile with stored token:", err)
          localStorage.removeItem("token") // Token inválido o expirado
          setToken(null)
          setUser(null)
        } finally {
          setLoading(false)
        }
      }
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const data = await loginUser(email, password)
      localStorage.setItem("token", data.token)
      setToken(data.token)
      setUser({ _id: data._id, username: data.username, email: data.email })
      setLoading(false)
      navigate("/") // Redirigir al inicio o al dashboard
      return { success: true }
    } catch (err) {
      setError(err.message || "Login failed")
      setLoading(false)
      return { success: false, error: err.message }
    }
  }

  const register = async (username, email, password) => {
    setLoading(true)
    setError(null)
    try {
      const data = await registerUser(username, email, password)
      localStorage.setItem("token", data.token)
      setToken(data.token)
      setUser({ _id: data._id, username: data.username, email: data.email })
      setLoading(false)
      navigate("/") // Redirigir al inicio o al dashboard
      return { success: true }
    } catch (err) {
      setError(err.message || "Registration failed")
      setLoading(false)
      return { success: false, error: err.message }
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
    navigate("/login") // Redirigir a la página de login
  }

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user, // Conveniencia para saber si hay un usuario logueado
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
