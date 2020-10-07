import "./CombatScreen.css";
import React, { useReducer } from "react";
import { Card, GameState } from "../game";
import { useGame } from "./Context";
import { Draggable, Droppable, DragRenderer } from "./DragAndDrop";
import { CardView } from "./CardView";
import { Orb } from "./Orbs";
import { Box } from "./Box";
import { CastSpellAction, EndTurnAction } from "../actions";
import { classNames } from "./utils";

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
      <Box flexDirection="column" marginBottom="32px" alignItems="center">
        <Orb color="black" size="huge">{game.monster.health}/{game.monster.maxHealth}</Orb>
        <h3>{game.monster.constructor.name}</h3>
      </Box>

      {game.state === GameState.Drafting ? (
        <button
          onClick={() => game.addActionBottom(new CastSpellAction())}
        >Cast</button>
      ) : (
        <button
          disabled={game.state === GameState.Reacting}
          onClick={() => game.addActionBottom(new EndTurnAction())}
        >End Turn</button>
      )}

      <DragRenderer<DragCardItem>>
        {item => (
          <CardView card={item.card} />
        )}
      </DragRenderer>

      <Box justifyContent="space-between">
        <Box flexDirection="column" alignItems="center" justifyContent="center">
          <Orb color="cyan">{game.player.mana}</Orb>
          <h3>Mana</h3>
        </Box>

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
                active={game.state === GameState.Casting && game.cursor === index}
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

        <Box flexDirection="column" alignItems="center" justifyContent="center">
          <Orb color="magenta">{game.player.might}</Orb>
          <h3>Might</h3>
        </Box>
      </Box>

      <Droppable<DragCardItem>
        accept="card"
        canDrop={({ card, source }) => canDropInHand(card, source)}
        onDrop={({ card, source }) => onDropInHand(card, source)}
      >
        <HandView>
          {game.hand.map(card => (
            <HandViewSlot key={card.uid}>
              <Draggable<DragCardItem>
                item={{ type: "card", card, source: "hand" }}
              >
                <CardView card={card} />
              </Draggable>
            </HandViewSlot>
          ))}
        </HandView>
      </Droppable>

      <Box flexDirection="column" alignItems="center" justifyContent="center">
        <Orb color="red" size="large">{game.player.health}/{game.player.maxHealth}</Orb>
      </Box>
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
  active?: boolean,
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

function SpellViewSlot({ active, children, ...otherProps }: SpellViewSlotProps) {
  let className = classNames({
    "spell-view-slot": true,
    "spell-view-slot-active": active,
  });

  return (
    <div className={className} {...otherProps}>
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
 * Hand View Components
 */

interface HandViewSlotProps {
  children?: React.ReactNode,
}

function HandViewSlot(props: HandViewSlotProps) {
  return (
    <div className="hand-view-slot">
      {props.children}
    </div>
  );
}
