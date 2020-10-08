import "./SpellView.css";
import React from "react";
import { Sprite } from "./Sprite";
import { classNames } from "./utils";

/**
 * Spell Builder Components
 */

interface SpellViewProps {
  children?: React.ReactNode,
}

export function SpellView(props: SpellViewProps) {
  return (
    <div className="spell-view">
      {props.children}
    </div>
  );
}

interface SpellViewSlotProps {
  children?: React.ReactNode,
  active?: boolean,
  hover?: boolean,
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

export function SpellViewSlot({ active, hover, children, ...props }: SpellViewSlotProps) {
  let className = classNames({
    "spell-view-slot": true,
    "spell-view-slot-active": active,
  });

  let sprite = "card_slot";
  if (active || hover) sprite = "card_slot_active";

  return (
    <div className={className} {...props}>
      <Sprite name={sprite}>
        {children}
      </Sprite>
    </div>
  );
}
