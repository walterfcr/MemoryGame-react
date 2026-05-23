export const normalizeDifficulty = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return 'Easy'

    case 'medium':
    case 'normal':
      return 'Medium'

    case 'hard':
      return 'Hard'

    default:
      return 'Easy'
  }
}
