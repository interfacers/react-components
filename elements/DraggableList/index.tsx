import React, { useRef } from "react";
import clamp from "lodash-es/clamp";
// @ts-ignore
import swap from "lodash-move";
import { useGesture } from "react-with-gesture";
import { useSprings, animated, interpolate } from "react-spring";

import "./style.css";

function DraggableList({ items, height }: { items: any[]; height: number }) {
  const order = useRef(items.map((_, index) => index)); // Store indicies as a local ref, this represents the item order
  // @ts-ignore
  const [springs, setSprings] = useSprings(
    items.length,
    // @ts-ignore
    fn(order.current, height)
  ); // Create springs, each corresponds to an item, controlling its transform, scale, etc.
  const bind = useGesture(({ args: [originalIndex], down, delta: [, y] }) => {
    const curIndex = order.current.indexOf(originalIndex);
    const curRow = clamp(Math.round((curIndex * height + y) / height), 0, items.length - 1);
    const newOrder = swap(order.current, curIndex, curRow);
    setSprings(fn(newOrder, height, down, originalIndex, curIndex, y)); // Feed springs new style data, they'll animate the view without causing a single render
    if (!down) order.current = newOrder;
  });
  return (
    <div className="content" style={{ height: items.length * height }}>
      {springs.map(
        (
          {
            zIndex,
            shadow,
            y,
            scale
          }: {
            zIndex: number;
            shadow: { interpolate: Function };
            y: number;
            scale: number;
          },
          i: number
        ) => (
          <animated.div
            {...bind(i)}
            key={i}
            style={{
              zIndex,
              boxShadow: shadow.interpolate((s: number) => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`),
              transform: interpolate([y, scale], (y, s) => `translate3d(0,${y}px,0) scale(${s})`)
            }}
            children={items[i]}
          />
        )
      )}
    </div>
  );
}

export default DraggableList;

// Returns fitting styles for dragged/idle items
const fn = (order: any[], height: number, down?: boolean, originalIndex?: number, curIndex?: number, y?: number) => (
  index: number
) =>
  down && index === originalIndex
    ? {
        // @ts-ignore
        y: curIndex * height + y,
        scale: 1.1,
        zIndex: "1",
        shadow: 15,
        immediate: (n: string) => n === "y" || n === "zIndex"
      }
    : {
        y: order.indexOf(index) * height,
        scale: 1,
        zIndex: "0",
        shadow: 1,
        immediate: false
      };
