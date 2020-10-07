import React, { useEffect } from "react";
import { useDrag, useDrop, useDragLayer, DragObjectWithType } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";

export function Draggable<T extends DragObjectWithType>({
  item,
  disabled = false,
  children = null,
} : {
  item: T,
  disabled?: boolean,
  children?: React.ReactNode,
}) {
  let [, ref, setPreviewImage] = useDrag({
    item,
    canDrag: () => !disabled,
  });

  useEffect(() => {
    setPreviewImage(getEmptyImage(), { captureDraggingState: true });
  }, []);

  return (
    <div className="draggable" ref={ref}>
      {children}
    </div>
  );
}

export function Droppable<T extends DragObjectWithType>({
  accept,
  canDrop = () => true,
  onDrop = () => {},
  children,
} : {
  accept: string,
  canDrop?: (item: T) => boolean,
  onDrop?: (item: T) => any,
  children: React.ReactNode,
}) {
  let [, ref] = useDrop<T, any, any>({
    accept: accept,
    canDrop: item => canDrop(item),
    drop: item => onDrop(item),
  });

  return (
    <div className="droppable" ref={ref}>
      {children}
    </div>
  );
}

const dragLayerStyles: React.CSSProperties = {
  position: "fixed",
  pointerEvents: "none",
  zIndex: 100,
  left: 0,
  top: 0,
  bottom: 0,
  right: 0,
}

export function DragRenderer<T extends DragObjectWithType>({
  children
} : {
  children: (item: T) => React.ReactNode
}) {
  let { item, isDragging, currentOffset } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging) {
    return null;
  }

  let itemStyles = currentOffset ? {
    transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)`
  } : {
    display: "none"
  };

  return (
    <div style={dragLayerStyles}>
      <div style={itemStyles} data-dragging-id={item.card.uid}>
        {children(item)}
      </div>
    </div>
  );
}
