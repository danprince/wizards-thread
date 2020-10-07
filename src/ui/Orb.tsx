import "./Orb.css";
import React, { useRef } from "react";

export function Orb({
  children,
  color = "white",
  size = "medium",
}: {
  children: React.ReactNode,
  color?: string,
  size?: "small" | "medium" | "large" | "huge"
}) {
  let ref = useRef<HTMLDivElement>();

  let style = {
    "--orb-color": color
  };

  return (
    <div
      ref={ref}
      className={`orb orb-color-${color} orb-size-${size}`}
      style={style as any}
    >
      {children}
    </div>
  );
}
