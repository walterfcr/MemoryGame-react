// API functions to communicate with your backend authentication endpoints
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3002/api"

// Helper to handle API responses
const handleResponse = async (response) => {
  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.error || "Something went wrong")
  }
  return result.data
}

// Register a new user
export const registerUser = async (username, email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    })
    return handleResponse(response)
  } catch (error) {
    console.error("Error registering user:", error)
    throw error
  }
}

// Login a user
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
    return handleResponse(response)
  } catch (error) {
    console.error("Error logging in user:", error)
    throw error
  }
}

// Get authenticated user profile
export const getProfile = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Send the token
      },
    })
    return handleResponse(response)
  } catch (error) {
    console.error("Error fetching profile:", error)
    throw error
  }
}
