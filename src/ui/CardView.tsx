import "./CardView.css";
import * as React from "react";
import { Card } from "../game";

interface CardViewProps {
  card: Card,
  glowing?: boolean,
}

export function CardView({ card, glowing }: CardViewProps) {
  return (
    <div className={`card-view ${glowing ? "card-view-glowing" : ""}`}>
      <strong>{card.name}</strong>
      <div>{card.description}</div>
    </div>
  );
}
