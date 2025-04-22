import React, { useState, useEffect, useRef } from 'react';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
import Layout from './Layout';
import { gsap } from 'gsap';
import { useTranslation } from 'react-i18next';
import './MemoryGame.css';

const MemoryGame = () => {
  const { t } = useTranslation();

  const category = localStorage.getItem("selectedCategory") || "musicians";
  const difficulty = localStorage.getItem("selectedDifficulty") || "Easy";

  const categoryLabel = t(category);
  const difficultyLabel = t(difficulty.toLowerCase());

  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [time, setTime] = useState(0);
  const [clickCount, setClickCount] = useState(0);

  const { width, height } = useWindowSize();

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
  const clickSound = useRef(new Audio("/sounds/click.mp3"));

  const containerRef = useRef(null);

  useEffect(() => {
    gsap.from(containerRef.current, {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: "power3.out"
    });
  }, []);

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
    setTime(0);
    setClickCount(0);
  };

  const handleCardClick = (index) => {
    if (flippedCards.length === 2 || cards[index].flipped || cards[index].matched) return;

    setClickCount((prev) => prev + 1);

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

      setTimeout(() => {
        if (firstCard.image === secondCard.image) {
          updatedCards[firstIdx].matched = true;
          updatedCards[secondIdx].matched = true;
          setMatchedPairs((prev) => prev + 1);
          setCards(updatedCards);
          setFlippedCards([]);

          const matchSound = new Audio("/sounds/match-sound.wav");
          matchSound.play();

          setTimeout(() => {
            updatedCards[firstIdx].background = "#17f5d7";
            updatedCards[secondIdx].background = "#17f5d7";
            setCards([...updatedCards]);
          }, 500);
        } else {
          setTimeout(() => {
            updatedCards[firstIdx].flipped = false;
            updatedCards[secondIdx].flipped = false;
            setCards([...updatedCards]);
            setFlippedCards([]);
          }, 1000);
        }
      }, 500);
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

  useEffect(() => {
    let timer;
    if (!gameWon) {
      timer = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameWon]);

  const handleBack = () => {
    clickSound.current.currentTime = 0;
    clickSound.current.play();
    window.history.back();
  };

  return (
    <Layout title={`${categoryLabel} - ${difficultyLabel}`} onBackClick={handleBack}>
      <div className="stats-container">
        <p>🕒 {t("time")}: {time}s</p>
        <p>🖱️ {t("clicks")}: {clickCount}</p>
      </div>

      <div ref={containerRef} className="memory-game">
        {gameWon && (
          <>
            <Confetti width={width} height={height} />
            <div className="win-message">
              <h2>🎉 {t("youWon")} 🎉</h2>
              <button onClick={loadImages}>{t("playAgain")}</button>
            </div>
          </>
        )}

        <div className={`card-grid ${difficulty.toLowerCase()} ${gameWon ? 'blurred' : ''}`}>
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
    </Layout>
  );
};

export default MemoryGame;
