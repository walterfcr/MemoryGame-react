"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Layout from "./Layout" // Importa el Layout para mostrar un mensaje de carga

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Si no está cargando y no está autenticado, redirige
    if (!loading && !isAuthenticated) {
      navigate("/login")
    }
  }, [isAuthenticated, loading, navigate])

  if (loading) {
    // Muestra un mensaje de carga mientras se verifica la autenticación
    return (
      <Layout title="Cargando...">
        <div style={{ textAlign: "center", padding: "50px", color: "white" }}>
          Cargando información de usuario...
        </div>
      </Layout>
    )
  }

  // Si está autenticado, renderiza los componentes hijos
  if (isAuthenticated) {
    return children
  }

  // Si no está autenticado y ya no está cargando, no renderiza nada (la redirección ya ocurrió)
  return null
}

export default ProtectedRoute
