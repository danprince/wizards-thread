import "./CardView.css";
import * as React from "react";
import { Card, CardType } from "../game";
import { classNames } from "./utils";

interface CardViewProps {
  card: Card,
  glowing?: boolean,
}

export function CardView({ card, glowing }: CardViewProps) {
  let className = classNames({
    "card-view": true,
    "card-view-glowing": glowing,
    "card-view-hex": card.type === CardType.Hex
  });

  return (
    <div className={className}>
      <strong>{card.name}</strong>
      <div>{card.description}</div>
      <div className="card-view-mana-orb">{card.cost}</div>
      {card.anchored && "⚓"}
      {card.forced && "⛢"}
    </div>
  );
}
