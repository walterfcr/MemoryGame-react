const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3002"

// Helper to handle API responses
const handleResponse = async (response) => {
  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.error || "Something went wrong")
  }
  return result.data
}

export const registerUser = async (username, email, password) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  })
  return handleResponse(response)
}

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
  return handleResponse(response)
}

export const getProfile = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return handleResponse(response)
}
