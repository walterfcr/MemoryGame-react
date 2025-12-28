// API functions to communicate with your backend
// Use VITE_API_BASE_URL for production, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3002"

// Helper to handle API responses
const handleResponse = async (response) => {
  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.error || "Something went wrong")
  }
  return result.data
}

// Save a game score to the backend
export const saveGameScore = async (scoreData, token) => {
  try {
    const headers = {
      "Content-Type": "application/json",
    }
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/scores`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(scoreData),
    })

    return handleResponse(response)
  } catch (error) {
    console.error("Error saving score:", error)
    throw error
  }
}

// Get all scores from backend with an optional limit and filters
export const getScores = async (limit = 50, category = "all", difficulty = "all") => {
  try {
    const response = await fetch(`${API_BASE_URL}/scores?limit=${limit}&category=${category}&difficulty=${difficulty}`)
    return handleResponse(response)
  } catch (error) {
    console.error("Error fetching scores:", error)
    throw error
  }
}

// NEW FUNCTION: Get scores for the authenticated user
export const getMyScores = async (token, limit = 50, category = "all", difficulty = "all") => {
  try {
    if (!token) {
      throw new Error("Authentication token is required to fetch user-specific scores.")
    }
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
    const response = await fetch(
      `${API_BASE_URL}/scores/me?limit=${limit}&category=${category}&difficulty=${difficulty}`,
      {
        headers: headers,
      },
    )
    return handleResponse(response)
  } catch (error) {
    console.error("Error fetching user scores:", error)
    throw error
  }
}

// Get scores for a specific category with an optional limit (now handled by getScores)
export const getScoresByCategory = async (category, limit = 50) => {
  // This function can now simply call getScores with the category filter
  return getScores(limit, category, "all")
}

// Get available categories
export const getCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`)
    return handleResponse(response)
  } catch (error) {
    console.error("Error fetching categories:", error)
    throw error
  }
}
