import "./Orbs.css";
import React from "react";

export function Orb({
  children,
  color = "white",
  size = "medium",
}: {
  children: React.ReactNode,
  color?: string,
  size?: "small" | "medium" | "large" | "huge"
}) {
  let style = {
    "--orb-color": color
  };

  return (
    <div className={`orb orb-color-${color} orb-size-${size}`} style={style as any}>
      {children}
    </div>
  );
}
