# 🧠 Memory Game – React

Interactive memory card game built with React and Firebase, featuring authentication, dynamic gameplay logic, real-time scoring, and a persistent leaderboard system.

---

## 🚀 Live Demo

👉 https://memory-game-react-cyan.vercel.app/

---

## ⚛️ Project Overview

This project is a **state-driven React application** that recreates a classic memory game while adding modern features such as user authentication, difficulty levels, multilingual support, and real-time scoring.

The application focuses on managing dynamic UI updates and user interactions in a game-like environment.

---

## 🎮 Core Features

### 🧩 Gameplay System

* Card matching logic with dynamic state updates
* Real-time feedback when flipping and matching cards
* Win condition detection and game reset

### 🎯 Difficulty Levels

* Easy, Medium, and Hard modes
* Different number of card pairs per level

### 🗂 Categories

* Multiple themes (movies, heroes, musicians, videogames)
* Dynamic loading of game assets

### 🌐 Multi-language Support

* Supports 3 languages
* Dynamic UI text switching

---

## 🔐 Authentication & Score System

* User login required to play (Firebase Auth)
* Score tracking based on performance
* Global leaderboard system shared across all users
* Persistent user data stored in Firebase Firestore

---

## 🔊 Audio & Animations

* Sound effects:

  * Card flip
  * Match success
  * Button interactions
  * Victory feedback

* Animations:

  * Smooth transitions using GSAP
  * Interactive UI feedback

---

## 🧠 Key React Concepts Implemented

* State management for game logic (cards, turns, matches)
* Conditional rendering based on game state
* Component-based architecture
* Event handling for user interactions
* Dynamic rendering of game data

---

## 🛠 Tech Stack

* **Frontend:** React
* **Animations:** GSAP
* **State Management:** React Hooks
* **Backend / DB:** Firebase (Firestore)
* **Authentication:** Firebase Auth
* **Styling:** CSS3

---

## 🧠 Challenges & Solutions

### Game State Management

Handling card selection, matching logic, and win conditions required precise state control.

✔ Solution:

* Managed game state using React hooks
* Controlled user interactions to prevent invalid moves

---

### Dynamic Game Configuration

Supporting multiple levels and categories required flexible logic.

✔ Solution:

* Created reusable logic to generate card sets dynamically
* Adjusted game difficulty based on selected level

---

### Data Persistence

Ensuring user scores and progress remain available across sessions.

✔ Solution:

* Stored user data and scores in Firebase Firestore
* Linked scores to authenticated users

---

### User Experience Enhancements

Providing feedback through sounds and animations without affecting performance.

✔ Solution:

* Integrated GSAP for smooth animations
* Triggered audio events based on game actions

---

## ⚙️ Installation

```bash
git clone https://github.com/walterfcr/MemoryGame-react.git
cd MemoryGame-react
npm install
npm run dev
```

---

## 🚀 Future Improvements

* User profiles with statistics
* Multiplayer mode
* Timer-based challenges

---

## 👨‍💻 Author

Walter Fallas Barrantes

---

## 📄 License

This project is for educational and portfolio purposes.
