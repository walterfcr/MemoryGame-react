"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Layout from "./Layout" 

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // redirect unauthenticated users to login
    if (!loading && !isAuthenticated) {
      navigate("/login")
    }
  }, [isAuthenticated, loading, navigate])

  if (loading) {
    
    return (
      <Layout title="Cargando...">
        <div style={{ textAlign: "center", padding: "50px", color: "white" }}>
          Cargando información de usuario...
        </div>
      </Layout>
    )
  }

  
  if (isAuthenticated) {
    return children
  }

  return null
}

export default ProtectedRoute
