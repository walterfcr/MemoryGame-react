export const calculateScore = (time, clickCount) => {
  const score = Math.max(1000 - (time * 5 + clickCount * 2), 0)

  return Math.round(score)
}