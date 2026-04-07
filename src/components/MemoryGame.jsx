import React, { useState, useEffect, useRef } from "react";
import useWindowSize from "react-use/lib/useWindowSize";
import Layout from "./Layout";
import { gsap } from "gsap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./MemoryGame.css";

const MemoryGame = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const [time, setTime] = useState(0);
  const [clickCount, setClickCount] = useState(0);

  const containerRef = useRef(null);

  const category = localStorage.getItem("selectedCategory") || "musicians";
  const difficulty = localStorage.getItem("selectedDifficulty") || "Easy";
  const playerName = localStorage.getItem("playerName") || t("guest");

  const totalPairs = { Easy: 4, Medium: 8, Hard: 12 };

  const categoryPrefixes = {
    heroes: { prefix: "TM01", count: 31 },
    movies: { prefix: "TM02", count: 35 },
    musicians: { prefix: "TM03", count: 40 },
    videogames: { prefix: "TM04", count: 37 },
  };

  const flipSound = useRef(new Audio("/sounds/flip.mp3"));
  const winSound = useRef(new Audio("/sounds/win.wav"));
  const clickSound = useRef(new Audio("/sounds/clicks.mp3"));

  // Animation
  useEffect(() => {
    gsap.from(containerRef.current, {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: "power3.out",
    });
  }, []);

  // Load images
  const loadImages = () => {
    const { prefix, count } = categoryPrefixes[category];
    const numPairs = totalPairs[difficulty];

    const allImages = Array.from({ length: count }, (_, i) => {
      const num = String(i + 1).padStart(3, "0");
      return `${prefix}-${num}.webp`;
    });

    const selectedImages = allImages
      .sort(() => 0.5 - Math.random())
      .slice(0, numPairs);

    const pairedImages = selectedImages.flatMap((img) => {
      const imagePath = `/images/${category}/${img}`;
      return [
        { id: `${img}-a`, image: imagePath, flipped: false, matched: false },
        { id: `${img}-b`, image: imagePath, flipped: false, matched: false },
      ];
    });

    setCards(pairedImages.sort(() => 0.5 - Math.random()));
    setFlippedCards([]);
    setMatchedPairs(0);
    setGameWon(false);
    setTime(0);
    setClickCount(0);
  };

  useEffect(() => loadImages(), []);

  // Handle click
  const handleCardClick = (index) => {
    if (
      flippedCards.length === 2 ||
      cards[index].flipped ||
      cards[index].matched ||
      gameWon
    )
      return;

    setClickCount((prev) => prev + 1);

    const updatedCards = [...cards];
    updatedCards[index].flipped = true;
    setCards(updatedCards);

    flipSound.current.currentTime = 0;
    flipSound.current.play();

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
        } else {
          updatedCards[firstIdx].flipped = false;
          updatedCards[secondIdx].flipped = false;
        }

        setCards([...updatedCards]);
        setFlippedCards([]);
      }, 800);
    }
  };

  // Timer
  useEffect(() => {
    let timer;
    if (!gameWon) {
      timer = setInterval(() => setTime((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [gameWon]);

  // WIN → navigate
  useEffect(() => {
    if (gameWon) return;

    const allMatched =
      cards.length > 0 && cards.every((c) => c.matched);

    if (allMatched) {
      const scoreCalc = Math.max(
        1000 - (time * 5 + clickCount * 2),
        0
      );

      winSound.current.play();

      navigate("/game-complete", {
        state: {
          playerName,
          category,
          difficulty,
          gameTime: time,
          totalMoves: clickCount,
          score: scoreCalc,
        },
      });
    }
  }, [cards, time, clickCount, gameWon]);

  const handleBack = () => {
    clickSound.current.currentTime = 0;
    clickSound.current.play();
    window.history.back();
  };

  return (
    <Layout
      title={`${t(category)} - ${t(difficulty.toLowerCase())}`}
      onBackClick={handleBack}
    >
      <div className="stats-container">
        <p>🕒 {t("time")}: {time}s</p>
        <p>🖱️ {t("clicks")}: {clickCount}</p>
      </div>

      <div ref={containerRef} className="memory-game">
        <div className={`card-grid ${difficulty.toLowerCase()}`}>
          {cards.map((card, idx) => (
            <div
              key={card.id}
              className="card"
              onClick={() => handleCardClick(idx)}
            >
              <div
                className={`card-inner ${
                  card.flipped || card.matched ? "flipped" : ""
                }`}
              >
                <div
                  className={`card-front ${
                    card.matched ? "matched" : ""
                  }`}
                >
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