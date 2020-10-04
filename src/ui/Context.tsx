import { useContext, useReducer, useEffect, createContext } from "react";
import { Game } from "../game";

let GameContext = createContext<Game>(null);

/**
 * Get a reference to the game object.
 */
export function useGame() {
  return useContext(GameContext);
}

/**
 * Force a component to update whenever the game finishes processing an
 * action.
 *
 * Also returns the game like useGame for convenience.
 */
export function useGameWithUpdates() {
  let game = useGame();

  let [, forceUpdate] = useReducer(x => x + 1, 0);

  useEffect(() => {
    let unsubscribe = game.onUpdate(forceUpdate);
    return unsubscribe;
  }, [game, forceUpdate]);

  return game;
}


export let GameProvider = GameContext.Provider;
