import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
import './MemoryGame.css';

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const { width, height } = useWindowSize();

  const category = localStorage.getItem("selectedCategory") || "musicians";
  const difficulty = localStorage.getItem("selectedDifficulty") || "Easy";

  const totalPairs = {
    Easy: 4,
    Medium: 8,
    Hard: 12,
  };

  const categoryPrefixes = {
    heroes: { prefix: "TM01", count: 30 },
    movies: { prefix: "TM02", count: 24 },
    musicians: { prefix: "TM03", count: 30 },
    videogames: { prefix: "TM04", count: 36 },
  };

  const flipSound = new Audio('/sounds/flip.mp3');

  const loadImages = () => {
    const { prefix, count } = categoryPrefixes[category];
    const numPairs = totalPairs[difficulty];

    const allImages = Array.from({ length: count }, (_, i) => {
      const num = String(i + 1).padStart(3, '0');
      return `${prefix}-${num}.png`;
    });

    const selectedImages = allImages
      .sort(() => 0.5 - Math.random())
      .slice(0, numPairs);

    const pairedImages = selectedImages.flatMap((img) => {
      const imagePath = `/images/${category}/${img}`;
      return [
        {
          id: `${img}-a`,
          image: imagePath,
          flipped: false,
          matched: false,
        },
        {
          id: `${img}-b`,
          image: imagePath,
          flipped: false,
          matched: false,
        },
      ];
    });

    const shuffledCards = pairedImages.sort(() => 0.5 - Math.random());

    setCards(shuffledCards);
    setMatchedPairs(0);
    setFlippedCards([]);
    setGameWon(false);
  };

  const handleCardClick = (index) => {
    if (flippedCards.length === 2 || cards[index].flipped || cards[index].matched) return;

    const updatedCards = [...cards];
    updatedCards[index].flipped = true;
    setCards(updatedCards);

    flipSound.currentTime = 0;
    flipSound.play();

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
        const [firstIdx, secondIdx] = newFlipped;
        const firstCard = updatedCards[firstIdx];
        const secondCard = updatedCards[secondIdx];

        // Delay the match sound and the background color change
        setTimeout(() => {
            if (firstCard.image === secondCard.image) {
                updatedCards[firstIdx].matched = true;
                updatedCards[secondIdx].matched = true;
                setMatchedPairs((prev) => prev + 1);
                setCards(updatedCards);
                setFlippedCards([]);
                
                // Play the match sound after a short delay (to let flip animation complete)
                const matchSound = new Audio("/sounds/match-sound.wav");
                matchSound.play();

                // Change the background color of matched cards to yellow
                setTimeout(() => {
                    updatedCards[firstIdx].background = "#17f5d7"; // Color when matched
                    updatedCards[secondIdx].background = "#17f5d7";
                    setCards([...updatedCards]);
                }, 500); // Delay the background color change after the sound

            } else {
                setTimeout(() => {
                    updatedCards[firstIdx].flipped = false;
                    updatedCards[secondIdx].flipped = false;
                    setCards([...updatedCards]);
                    setFlippedCards([]);
                }, 1000);
            }
        }, 500); // Match logic happens after 500ms (just after the card flip animation)
    }
};

  useEffect(() => {
    loadImages();
  }, []);

  useEffect(() => {
    if (matchedPairs === totalPairs[difficulty]) {
      setTimeout(() => {
        setGameWon(true);
        localStorage.removeItem("selectedCategory");
        localStorage.removeItem("selectedDifficulty");
      }, 300);
    }
  }, [matchedPairs, difficulty]);

  return (
    <div className="memory-game">
      {gameWon && (
        <>
          <Confetti width={width} height={height} />
          <div className="win-message">
            <h2>🎉 You won! 🎉</h2>
            <button onClick={loadImages}>Play Again</button>
          </div>
        </>
      )}

      <div className={`card-grid ${gameWon ? 'blurred' : ''}`}>
        {cards.map((card, index) => (
          <div
            key={card.id}
            className="card"
            onClick={() => handleCardClick(index)}
          >
            <div className={`card-inner ${card.flipped || card.matched ? 'flipped' : ''}`}>
              <div className={`card-front ${card.matched ? 'matched' : ''}`}>
                <img src={card.image} alt="front" />
              </div>
              <div className="card-back">
                <img src="/images/placeholder.png" alt="back" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemoryGame;
