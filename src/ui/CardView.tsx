import "./CardView.css";
import React, { useMemo } from "react";
import { Card, CardType } from "../game";
import { Sprite, Icon } from "./Sprite";
import { classNames } from "./utils";
import { Box } from "./Box";
import { CardTextToken, parseCardText } from "../utils/card-text-parser";

interface CardViewProps {
  card: Card,
  glowing?: boolean,
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

export function CardView({ card, glowing, ...rest }: CardViewProps) {
  let className = classNames({
    "card-view": true,
    "card-view-enemy": card.type !== CardType.Normal,
  });

  return (
    <div className={className} {...rest}>
      <Sprite name={card.type === CardType.Normal ? "card_face_normal" : "card_face_enemy"}>
        <Sprite name={card.type === CardType.Normal ? "card_frame_normal" : "card_frame_red"}>
          <div className="card-view-content">
            <Sprite className="card-view-portrait" name={`card_portrait_${card.id}`} />
            <div className="card-view-name">{card.name}</div>
            <div className="card-view-description">
              <CardDescriptionText card={card} />
            </div>

            <Sprite
              className="card-view-orb"
              name={card.type === CardType.Normal ? "card_orb_normal" : "card_orb_enemy"}
            >
              <Sprite name="card_orb_frame_blue" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Box justifyContent="center" alignItems="center">
                  {card.cost}
                </Box>
              </Sprite>
            </Sprite>

            <Box alignItems="center" justifyContent="center">
              {card.anchored && (
                <Sprite name="icon_anchor" />
              )}
              {card.type === CardType.Enemy && (
                <Sprite name="icon_enemy" />
              )}
            </Box>
          </div>
        </Sprite>
      </Sprite>
    </div>
  );
}

function CardDescriptionText({ card }: { card: Card }) {
  let tokens = useMemo(() => parseCardText(card.description), [card.description]);

  function renderToken(token: CardTextToken) {
    if (token.type === "text") {
      return token.value;
    }

    if (token.type === "em") {
      return <em>{token.value}</em>;
    }

    if (token.type === "num") {
      return <big>{token.value}</big>;
    }

    if (token.type === "var") {
      switch (token.value) {
        case "might":
          return <Icon name="icon_orb_purple" />;
        case "mana":
          return <Icon name="icon_orb_blue" />;
        case "health":
          return <Icon name="icon_orb_red" />;
        case "gold":
          return <Icon name="icon_orb_gold" />;
        default:
          throw new Error(`No icon variable: ${token.value}`);
      }
    }
  }

  return (
    <>
      {tokens.map((token, index) => (
        <span key={index}>
          {renderToken(token)}
        </span>
      ))}
    </>
  );
}

