import "./index.css";
import React from "react";
import { render } from "react-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Game, GameState } from "../game";
import { GameProvider, useGameWithUpdates } from "./Context";
import { CombatScreen } from "./CombatScreen";
import cityBackgroundSrc from "../assets/city.png";

function App() {
  let game = useGameWithUpdates();

  switch (game.state) {
    case GameState.Initializing:
      return <LoadingScreen />;
    case GameState.Drafting:
    case GameState.Casting:
      return <CombatScreen />;
    default:
      return null;
  }
}

function LoadingScreen() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }}>
      <h1>Wizard's Thread</h1>
      <div>Loading</div>
    </div>
  )
}

function Root({ game }: { game: Game }) {
  return (
    <GameProvider value={game}>
      <DndProvider backend={HTML5Backend}>
        <App />
      </DndProvider>
    </GameProvider>
  );
}

export function init(game: Game, element: HTMLElement) {
  render(
    <Root game={game} />,
    element,
  );
}

// TODO: Figure out why I can't do this through CSS (vite not resolving
// the image src).
document.body.style.backgroundImage = `url(${cityBackgroundSrc})`;
