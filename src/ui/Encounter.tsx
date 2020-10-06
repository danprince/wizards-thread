import "./Encounter.css";
import React, { useReducer, useEffect } from "react";
import { classNames } from "./utils";
import { CastSpellAction, EndTurnAction } from "../actions";
import { Game, Card, State } from "../game";
import { useGameWithUpdates } from "./Context";
import { CardView } from "./CardView";

type EncounterState = {
  hand: Card[],
  spell: Card[],
  activeCard: Card,
  intentIndex: number,
}

type EncounterActions =
  | { type: "SET_CARDS", cards: Card[] }
  | { type: "RESET_SPELL" }
  | { type: "SET_ACTIVE_CARD", card: Card }
  | { type: "SET_INTENT_SLOT", index: number }
  | { type: "INSERT_CARD", index: number }
  | { type: "REMOVE_CARD", index: number }

function EncounterReducer(state: EncounterState, action: EncounterActions): EncounterState {
  switch (action.type) {
    case "SET_CARDS": {
      let cards: Card[] = Array.from({ length: 6 });
      Object.assign(cards, action.cards);
      return { ...state, spell: cards };
    }

    case "RESET_SPELL": {
      let spell: Card[] = Array.from({ length: 6 });
      let hand = [...state.hand, ...state.spell].filter(c => c);
      return { ...state, spell, hand };
    }

    case "SET_ACTIVE_CARD": {
      if (state.activeCard === action.card) {
        return { ...state, activeCard: null };
      } else {
        return { ...state, activeCard: action.card };
      }
    }

    case "SET_INTENT_SLOT": {
      return { ...state, intentIndex: action.index };
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
    spell: Array.from({ length: 6 }),
    activeCard: null,
    intentIndex: -1,
  };
}

export function EncounterScreen() {
  let game = useGameWithUpdates();

  let [state, dispatch] = useReducer(EncounterReducer, game, initState);

  useEffect(() => {
    dispatch({ type: "SET_CARDS", cards: game.spell.cards });
  }, [game.spell.cards]);

  function cast() {
    game.addActionTop(new CastSpellAction(state.spell));
  }

  function endTurn() {
    game.addActionTop(new EndTurnAction());
  }

  function toggleSpellSlot(index: number) {
    let card = state.spell[index];

    if (game.state === State.Drafting) {
      if (card) {
        dispatch({ type: "REMOVE_CARD", index });
      } else if (state.activeCard) {
        if (!state.activeCard.anchored || state.activeCard.anchorIndex === index) {
          dispatch({ type: "INSERT_CARD", index });
        }
      }
    }
  }

  function setActiveCard(card: Card) {
    if (game.state === State.Drafting) {
      if (!(state.activeCard && state.activeCard.forced)) {
        dispatch({ type: "SET_ACTIVE_CARD", card });
      }
    }
  }

  function setIntentSlot(index: number) {
    if (game.state === State.Drafting) {
      dispatch({ type: "SET_INTENT_SLOT", index });
    }
  }

  function reset() {
    if (game.state === State.Drafting) {
      dispatch({ type: "RESET_SPELL" });
    }
  }

  function isActiveCard(card: Card) {
    return game.state === State.Drafting && card === state.activeCard;
  }

  function isCurrentCard(card: Card) {
    return game.state === State.Casting && card === game.spell.getCurrentCard();
  }

  let hasCards = state.spell.filter(c => c).length > 0;
  let isDrafting = game.state === State.Drafting;
  let isCasting = game.state === State.Casting;
  let isReacting = game.state === State.Reacting;

  return (
    <div className="encounter">
      <div className="encounter-battlefield" style={{ display: "flex" }}>
        State: {game.state}
        <div>
          <h4>Player</h4>
          <div>Mana: {game.player.mana}/{game.player.baseMana}</div>
          <div>Health: {game.player.health}/{game.player.maxHealth}</div>
          <div>Might: {game.player.might}</div>
        </div>
        <div>
          <h4>Monster</h4>
          <div>Health: {game.monster.health}/{game.monster.maxHealth}</div>
          <div>Attack: {game.monster.attackDamage}</div>
        </div>
      </div>

      <h3>Spell</h3>
      <button disabled={!isDrafting || !hasCards} onClick={cast}>Cast</button>
      <button disabled={!isDrafting || !hasCards} onClick={reset}>Clear</button>
      <button disabled={isReacting} onClick={endTurn}>End Turn</button>

      <SpellBuilder>
        {state.spell.map((card, index) => (
          <div
            key={index}
            className="spell-builder-slot"
            onClick={() => toggleSpellSlot(index)}
            onMouseEnter={() => setIntentSlot(index)}
            onMouseLeave={() => setIntentSlot(-1)}
          >
            {card ? (
              <CardView card={card} glowing={isCurrentCard(card)}/>
            ) : (
              <SpellBuilderSlotEmpty glowing={game.state === State.Drafting && state.activeCard && (state.activeCard.anchorIndex === undefined || state.activeCard.anchorIndex === index)}>
                {(
                  index === state.intentIndex &&
                  state.activeCard &&
                  (state.activeCard.anchorIndex === undefined || state.activeCard.anchorIndex === index)
                ) && (
                  <div style={{opacity: 0.5}}>
                    <CardView card={state.activeCard} />
                  </div>
                )}
              </SpellBuilderSlotEmpty>
            )}
          </div>
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

export function SpellBuilderSlotEmpty({ glowing, children = null }) {
  return (
    <div
      className={classNames({
        "spell-builder-slot-empty": true,
        "spell-builder-slot-glowing": glowing
      })}
      children={children}
    />
  );
}

