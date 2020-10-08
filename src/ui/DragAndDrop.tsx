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
  let [{ isDragging }, ref, setPreviewImage] = useDrag({
    item,
    canDrag: () => !disabled,
    collect: monitor => ({ isDragging: monitor.isDragging() })
  });

  useEffect(() => {
    setPreviewImage(getEmptyImage(), { captureDraggingState: true });
  }, []);

  let style: React.CSSProperties = {
    opacity: isDragging ? 0 : 1
  };

  return (
    <div className="draggable" ref={ref} style={style}>
      {children}
    </div>
  );
}

interface DroppableChildProps {
  canDrop: boolean,
  isOver: boolean,
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
  children: React.ReactNode | ((props: DroppableChildProps) => React.ReactNode),
}) {
  let [droppableProps, ref] = useDrop<T, any, any>({
    accept: accept,
    canDrop: item => canDrop(item),
    drop: item => onDrop(item),
    collect: (monitor): DroppableChildProps => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(),
    })
  });

  return (
    <div className="droppable" ref={ref}>
      {typeof children === "function" ? children(droppableProps) : children}
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
  children,
  xAxisLock = () => false,
  yAxisLock = () => false,
} : {
  children: (item: T) => React.ReactNode,
  xAxisLock?: (item: T) => boolean,
  yAxisLock?: (item: T) => boolean,
}) {
  let { item, isDragging, currentOffset, initialOffset } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    currentOffset: monitor.getSourceClientOffset(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging) {
    return null;
  }

  if (item && currentOffset) {
    if (xAxisLock(item)) {
      currentOffset.x = initialOffset.x;
    }

    if (yAxisLock(item)) {
      currentOffset.y = initialOffset.y;
    }
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
