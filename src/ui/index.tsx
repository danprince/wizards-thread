import React from "react";
import { render } from "react-dom";
import { Game } from "../game";
import { GameProvider, useGameWithUpdates } from "./Context";
import { CastSpellAction } from "../actions";

function Root({ game }: { game: Game }) {
  return (
    <GameProvider value={game}>
      <App />
    </GameProvider>
  );
}

function App() {
  let game = useGameWithUpdates();

  let startCasting = () => {
    game.addActionTop(new CastSpellAction());
  }

  return (
    <div>
      <button onClick={startCasting}>Cast</button>
      <pre>{JSON.stringify(game, null, 2)}</pre>
    </div>
  );
}

export function init(game: Game, element: HTMLElement) {
  render(
    <Root game={game} />,
    element,
  );
}
