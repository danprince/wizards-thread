import "./CombatScreen.css";
import React, { useReducer } from "react";
import { Card, GameState } from "../game";
import { useGame } from "./Context";
import { Draggable, Droppable, DragRenderer } from "./DragAndDrop";
import { CardView } from "./CardView";
import { Box } from "./Box";
import { CastSpellAction, EndTurnAction } from "../actions";
import { Sprite, Icon } from "./Sprite";
import { classNames } from "./utils";
import { Button } from "./Button";

type CardSource = "hand" | "spell"

interface DragCardItem {
  type: "card",
  card: Card,
  source: CardSource,
}

export function CombatScreen() {
  let game = useGame();

  // FIXME: Keep the component in sync with the game when it mutates.
  // Need the game to dispatch events that let the UI know to update.
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
    if (card.anchored) {
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
      {game.state === GameState.Drafting ? (
        <Button
          onClick={() => game.addActionBottom(new CastSpellAction())}
        >Cast</Button>
      ) : (
        <Button
          disabled={game.state === GameState.Reacting}
          onClick={() => game.addActionBottom(new EndTurnAction())}
        >End Turn</Button>
      )}

      <Box justifyContent="space-between">
        <Box flexDirection="column" alignItems="center" justifyContent="center" margin="8px">
          <Sprite name="orb_red">
            <Box justifyContent="center" alignItems="center" color="white" fontWeight="bold" height="100%" textShadow="0 2px black">
              {game.player.health}
            </Box>
          </Sprite>
          <h4>Health</h4>
        </Box>

        <Box flexDirection="column" alignItems="center" justifyContent="center" margin="8px">
          <Sprite name="orb_blue">
            <Box justifyContent="center" alignItems="center" color="white" fontWeight="bold" height="100%" textShadow="0 2px black">
              {game.player.mana}
            </Box>
          </Sprite>
          <h4>Mana</h4>
        </Box>

        <Box flexDirection="column" alignItems="center" justifyContent="center" margin="8px">
          <Sprite name="orb_purple">
            <Box justifyContent="center" alignItems="center" color="white" fontWeight="bold" height="100%" textShadow="0 2px black">
              {game.player.might}
            </Box>
          </Sprite>
          <h4>Might</h4>
        </Box>
      </Box>

      <DragRenderer<DragCardItem> yAxisLock={({ card, source }) => source === "spell" && card.forced}>
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
                active={game.state === GameState.Casting && game.cursor === index}
              >
                {card && (
                  <Draggable
                    item={{ type: "card", card, source: "spell" }}
                    disabled={card.forced && card.anchored}
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

function SpellViewSlot({ active, children, ...props }: SpellViewSlotProps) {
  let className = classNames({
    "spell-view-slot": true,
    "spell-view-slot-active": active,
  });

  return (
    <div className={className} {...props}>
      <Sprite name={!active ? "card_slot" : "card_slot_active"}>
        {children}
      </Sprite>
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
