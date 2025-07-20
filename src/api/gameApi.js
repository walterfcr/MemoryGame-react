// API functions to communicate with your backend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3002/api";


// Save a game score to the backend
export const saveGameScore = async (scoreData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/scores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(scoreData), 
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || "Failed to save score")
    }

    return result
  } catch (error) {
    console.error("Error saving score:", error)
    throw error
  }
}

// Get all scores from backend
export const getScores = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/scores`)
    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || "Failed to fetch scores")
    }
    

    return result.data
  } catch (error) {
    console.error("Error fetching scores:", error)
    throw error
  }
}

// Get scores for a specific category
export const getScoresByCategory = async (category) => {
  try {
    const response = await fetch(`${API_BASE_URL}/scores/${category}`)
    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || "Failed to fetch category scores")
    }

    return result.data
  } catch (error) {
    console.error("Error fetching category scores:", error)
    throw error
  }
}

// Get available categories
export const getCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`)
    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || "Failed to fetch categories")
    }

    return result.data
  } catch (error) {
    console.error("Error fetching categories:", error)
    throw error
  }
}
