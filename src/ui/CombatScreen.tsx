import "./CombatScreen.css";
import React, { useReducer } from "react";
import { Draggable, Droppable, DragRenderer } from "./DragAndDrop";
import { useGame } from "./Context";
import { CardView } from "./CardView";
import { Card } from "../game";

type CardSource = "hand" | "spell"

interface DragCardItem {
  type: "card",
  card: Card,
  source: CardSource,
}

export function CombatScreen() {
  let game = useGame();

  // Hack to keep the component in sync with the game when it mutates
  let [_, forceUpdate] = useReducer(x => x + 1, 0);

  // Only cards being moved from the spell can be dropped into the hand
  // Forced cards can't be removed from the spell.
  function canDropInHand(card: Card, source: CardSource) {
    return source === "spell" && !card.forced;
  }

  function onDropInHand(card: Card, source: CardSource) {
    game.removeFromSpell(card);
    game.addToHand(card);
    forceUpdate();
  }

  // Cards can't be dropped into the spell if there's already a card
  // there.
  function canDropInSpell(card: Card, source: CardSource, index: number) {
    if (card.anchored && card.anchorIndex !== index) {
      return false;
    }

    return game.spell[index] == null;
  }

  function onDropInSpell(card: Card, source: CardSource, index: number) {
    if (source === "spell") {
      game.removeFromSpell(card);
    } else {
      game.removeFromHand(card);
    }

    game.addToSpell(card, index);
    forceUpdate();
  }

  return (
    <div className="combat-screen">
      <DragRenderer<DragCardItem>>
        {item => (
          <CardView card={item.card} />
        )}
      </DragRenderer>

      <SpellView>
        {game.spell.map((card, index) => (
          <Droppable<DragCardItem>
            key={index}
            accept="card"
            onDrop={({ card, source }) => onDropInSpell(card, source, index)}
            canDrop={({ card, source }) => canDropInSpell(card, source, index)}
          >
            <SpellViewSlot
              key={index}
              empty={!card}
            >
              {card && (
                <Draggable
                  item={{ type: "card", card, source: "spell" }}
                  disabled={card.forced && card.anchored || index === card.anchorIndex}
                >
                  <CardView card={card} />
                </Draggable>
              )}
            </SpellViewSlot>
          </Droppable>
        ))}
      </SpellView>

      <Droppable<DragCardItem>
        accept="card"
        canDrop={({ card, source }) => canDropInHand(card, source)}
        onDrop={({ card, source }) => onDropInHand(card, source)}
      >
        <HandView>
          {game.hand.map(card => (
            <Draggable<DragCardItem>
              key={card.uid}
              item={{ type: "card", card, source: "hand" }}
            >
              <CardView key={card.uid} card={card} />
            </Draggable>
          ))}
        </HandView>
      </Droppable>
    </div>
  );
}

/**
 * Spell Builder Components
 */

interface SpellViewProps {
  children?: React.ReactNode,
}

function SpellView(props: SpellViewProps) {
  return (
    <div className="spell-view">
      {props.children}
    </div>
  );
}

interface SpellViewSlotProps {
  children?: React.ReactNode,
  empty?: boolean,
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

function SpellViewSlot({ empty, children, ...otherProps }: SpellViewSlotProps) {
  return (
    <div className="spell-view-slot" {...otherProps}>
      {children}
    </div>
  );
}

/**
 * Hand View Components
 */

interface HandViewProps {
  children?: React.ReactNode,
}

function HandView(props: HandViewProps) {
  return (
    <div className="hand-view">
      {props.children}
    </div>
  );
}

/**
 * Drag and Drop Components
 */
