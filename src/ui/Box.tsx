import React from "react";

interface BoxProps extends React.CSSProperties {
  children: React.ReactNode,
}

export function Box({ children, ...style }: BoxProps) {
  return (
    <div style={{ display: "flex", ...style }}>
      {children}
    </div>
  );
}
