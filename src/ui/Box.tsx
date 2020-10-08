import React from "react";

interface BoxProps extends React.CSSProperties {
  children?: React.ReactNode,
  className?: string,
}

export function Box({ className, children, ...style }: BoxProps) {
  return (
    <div className={className} style={{ display: "flex", ...style }}>
      {children}
    </div>
  );
}
