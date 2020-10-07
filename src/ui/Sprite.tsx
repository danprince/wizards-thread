import React from "react";
import atlas from "../assets/sprites.json";
import atlasSrc from "../assets/sprites.png";

export function createSpriteStyles(name: string): React.CSSProperties {
  let slice = atlas.meta.slices.find(slice => slice.name === name);

  if (slice == null) {
    //console.warn(`Sprite does not exist: ${name}`);
    return null;
  }

  let { x, y, w, h } = slice.keys[0].bounds;

  return {
    imageRendering: "pixelated",
    backgroundImage: `url(${atlasSrc})`,
    backgroundPosition: `-${x}px -${y}px`,
    width: w,
    height: h,
  };
}

interface SpriteProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
}

export function Sprite({ name, ...props }: SpriteProps) {
  let style = {
    ...props.style,
    ...createSpriteStyles(name),
  };

  return (
    <div {...props} style={style} />
  );
}

export function Icon(props: SpriteProps) {
  let style: React.CSSProperties = {
    verticalAlign: "middle",
    display: "inline-block",
    ...props.style,
  };

  return (
    <Sprite {...props} style={style} />
  );
}
