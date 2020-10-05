import "./Encounter.css";
import React, { useReducer } from "react";
import { CastSpellAction } from "../actions";
import { Game, Card, State } from "../game";
import { useGameWithUpdates } from "./Context";
import { CardView } from "./CardView";

type EncounterState = {
  hand: Card[],
  spell: Card[],
  activeCard: Card,
}

type EncounterActions =
  | { type: "SET_ACTIVE_CARD", card: Card }
  | { type: "INSERT_CARD", index: number }
  | { type: "REMOVE_CARD", index: number }

function EncounterReducer(state: EncounterState, action: EncounterActions): EncounterState {
  switch (action.type) {
    case "SET_ACTIVE_CARD": {
      if (state.activeCard === action.card) {
        return { ...state, activeCard: null };
      } else {
        return { ...state, activeCard: action.card };
      }
    }

    case "INSERT_CARD": {
      let spell = [...state.spell];
      spell[action.index] = state.activeCard;
      let hand = state.hand.filter(c => c !== state.activeCard);
      return { ...state, spell, hand, activeCard: null };
    }

    case "REMOVE_CARD": {
      let spell = [...state.spell];
      let card = spell[action.index];
      spell[action.index] = undefined;

      let hand = [...state.hand, card];

      return { ...state, spell, hand, activeCard: card };
    }
  }
}

function initState(game: Game): EncounterState {
  return {
    hand: game.deck,
    spell: Array.from({ length: 5 }),
    activeCard: null,
  };
}

export function EncounterScreen() {
  let game = useGameWithUpdates();

  let [state, dispatch] = useReducer(EncounterReducer, game, initState);

  function cast() {
    // TODO: Indexes won't match when removing slots
    game.spell.cards = state.spell.filter(card => card);
    game.addActionTop(new CastSpellAction());
  }

  function toggleSpellSlot(index: number) {
    if (game.state === State.Drafting) {
      if (state.spell[index]) {
        dispatch({ type: "REMOVE_CARD", index });
      } else if (state.activeCard) {
        dispatch({ type: "INSERT_CARD", index });
      }
    }
  }

  function setActiveCard(card: Card) {
    if (game.state === State.Drafting) {
      dispatch({ type: "SET_ACTIVE_CARD", card });
    }
  }

  function isActiveCard(card: Card) {
    return game.state === State.Drafting && card === state.activeCard;
  }

  function isCurrentCard(card: Card) {
    return game.state === State.Casting && card === game.spell.getCurrentCard();
  }

  return (
    <div className="encounter">
      <strong>Player</strong>
      <pre>Mana: {game.player.mana} Health: {game.player.health} Might: {game.player.might}</pre>

      <strong>Monster</strong>
      <pre>Health: {game.monster.health}</pre>

      <h3>Spell</h3>
      <button disabled={game.state !== State.Drafting} onClick={cast}>Cast</button>

      <SpellBuilder>
        {state.spell.map((card, index) => (
          <SpellBuilderSlot
            key={index}
            onClick={() => toggleSpellSlot(index)}
          >
            {card ? (
              <CardView card={card} glowing={isCurrentCard(card)}/>
            ) : (
              <SpellBuilderSlotEmpty />
            )}
          </SpellBuilderSlot>
        ))}
      </SpellBuilder>

      <h3>Hand</h3>
      <Hand>
        {state.hand.map(card => (
          <HandSlot key={card.uid} onClick={() => setActiveCard(card)}>
            <CardView card={card} glowing={isActiveCard(card)} />
          </HandSlot>
        ))}
      </Hand>
    </div>
  );
}

export function Hand({ children }) {
  return (
    <div className="hand">
      {children}
    </div>
  );
}

export function HandSlot({ children, onClick }) {
  return (
    <div className="hand-slot" onClick={onClick}>
      {children}
    </div>
  );
}

/**
 *
 */
export function SpellBuilder({ children }) {
  return (
    <div className="spell-builder">
      {children}
    </div>
  );
}

export function SpellBuilderSlot({ children, onClick }) {
  return (
    <div className="spell-builder-slot" onClick={onClick}>
      {children}
    </div>
  );
}

export function SpellBuilderSlotEmpty({}) {
  return (
    <div className="spell-builder-slot-empty">
    </div>
  );
}

