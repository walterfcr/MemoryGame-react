// GameCompleteWrapper.jsx
import { useLocation, useNavigate } from "react-router-dom";
import GameComplete from "./GameComplete";

const GameCompleteWrapper = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    navigate("/");
    return null;
  }

  return (
    <GameComplete
      playerName={state.playerName}
      category={state.category}
      difficulty={state.difficulty}
      gameTime={state.gameTime}
      totalMoves={state.totalMoves}
      onPlayAgain={() => navigate("/play")}
    />
  );
};

export default GameCompleteWrapper;