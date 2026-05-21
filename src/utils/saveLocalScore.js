export const saveLocalScore = (scoreData) => {
  const localScores = JSON.parse(
    localStorage.getItem("memoryGameScores") || "[]"
  )

  localStorage.setItem(
    "memoryGameScores",
    JSON.stringify([scoreData, ...localScores].slice(0, 10))
  )
}