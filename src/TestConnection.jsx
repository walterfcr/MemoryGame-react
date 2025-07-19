"use client"

import { useState } from "react"

function TestConnection() {
  const [serverData, setServerData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const testConnection = async () => {
    setLoading(true)
    setError(null)

    try {
      // Call your Node.js server
      const response = await fetch("http://localhost:3002/api/game-info")
      const data = await response.json()
      setServerData(data)
      console.log("Data from server:", data)
    } catch (err) {
      setError("Failed to connect to server: " + err.message)
      console.error("Connection error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "20px" }}>
      <h3>🔗 Backend Connection Test</h3>

      <button
        onClick={testConnection}
        disabled={loading}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: loading ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Connecting..." : "Test Server Connection"}
      </button>

      {error && <div style={{ color: "red", marginTop: "10px" }}>❌ {error}</div>}

      {serverData && (
        <div style={{ marginTop: "20px" }}>
          <h4>✅ Server Response:</h4>
          <pre style={{ backgroundColor: "#f5f5f5", padding: "10px", borderRadius: "5px" }}>
            {JSON.stringify(serverData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export default TestConnection
