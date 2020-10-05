import "./index.css";
import React from "react";
import { render } from "react-dom";
import { Game, State } from "../game";
import { GameProvider, useGameWithUpdates } from "./Context";
import { EncounterScreen } from "./Encounter";

function App() {
  let game = useGameWithUpdates();

  switch (game.state) {
    case State.Drafting:
    case State.Casting:
    case State.Reacting:
      return <EncounterScreen />;
    default:
      return null;
  }
}

function Root({ game }: { game: Game }) {
  return (
    <GameProvider value={game}>
      <App />
    </GameProvider>
  );
}

export function init(game: Game, element: HTMLElement) {
  render(
    <Root game={game} />,
    element,
  );
}
