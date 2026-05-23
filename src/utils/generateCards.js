const totalPairs = {
  Easy: 4,
  Medium: 8,
  Hard: 12,
}

const categoryPrefixes = {
  heroes: { prefix: "TM01", count: 30 },
  movies: { prefix: "TM02", count: 24 },
  musicians: { prefix: "TM03", count: 30 },
  videogames: { prefix: "TM04", count: 36 },
}

const shuffle = (array) => {
  return [...array].sort(() => 0.5 - Math.random())
}

export const generateCards = (category, difficulty) => {
  const { prefix, count } = categoryPrefixes[category]
  const numPairs = totalPairs[difficulty]

  const allImages = Array.from({ length: count }, (_, i) => {
    const num = String(i + 1).padStart(3, "0")
    return `${prefix}-${num}.webp`
  })

  const selectedImages = shuffle(allImages).slice(0, numPairs)

  // duplicate each image to create matching pairs
  const pairedCards = selectedImages.flatMap((img) => {
    const path = `/images/${category}/${img}`

    return [
      {
        id: `${img}-a`,
        image: path,
        flipped: false,
        matched: false,
        highlight: false,
      },
      {
        id: `${img}-b`,
        image: path,
        flipped: false,
        matched: false,
        highlight: false,
      },
    ]
  })

  return shuffle(pairedCards)
}