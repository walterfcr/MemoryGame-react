import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import StartPage from './components/StartPage';
import DifficultySelector from './components/DifficultySelector';
import CategorySelector from './components/CategorySelector';
import ScoreBoard from './components/ScoreBoard';
import LanguageSelector from './components/LanguageSelector';
import Credits from './components/Credits';
import Login from './components/Login';
import MemoryGame from './components/MemoryGame';
import './index.css';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('musicians');
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy');

  return (
    <div className="mainContainer">
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/difficulty" element={
          <DifficultySelector setDifficulty={setSelectedDifficulty} />
        } />
        <Route path="/categories" element={
          <CategorySelector setCategory={setSelectedCategory} />
        } />
        <Route path="/score" element={<ScoreBoard />} />
        <Route path="/language" element={<LanguageSelector />} />
        <Route path="/credits" element={<Credits />} />
        <Route path="/play" element={
          <MemoryGame
            category={selectedCategory}
            difficulty={selectedDifficulty}
          />
        } />
      </Routes>
    </div>
  );
}

export default App;
