import "./Button.css";
import React from "react";

type ButtonProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export function Button(props: ButtonProps) {
  return (
    <button {...props} />
  );
}
