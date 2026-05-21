export const calculateScore = (time, clicks) => {
  return Math.max(1000 - (time * 5 + clicks * 2), 0)
}