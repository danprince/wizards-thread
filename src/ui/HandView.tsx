import "./HandView.css";
import React from "react";

interface HandViewProps {
  children?: React.ReactNode,
}

export function HandView(props: HandViewProps) {
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

export function HandViewSlot(props: HandViewSlotProps) {
  return (
    <div className="hand-view-slot">
      {props.children}
    </div>
  );
}
