import SelectionArea, { SelectionEvent } from "@viselect/react";
import React, { useEffect, useState } from "react";
import Item from "./Item";
import "./style.css";

interface AppProps {
  rows: number;
  cols: number;
}

export default function App({ rows, cols }: AppProps) {
  const [selected, setSelected] = useState<Set<number>>(() => new Set());

  const extractIds = (els: Element[]): number[] =>
    els
      .map((v) => v.getAttribute("data-key"))
      .filter(Boolean)
      .map(Number);

  const onStart = ({ event, selection }: SelectionEvent) => {
    if (!event?.ctrlKey && !event?.metaKey) {
      selection.clearSelection();
      setSelected(() => new Set());
    }
  };

  const onMove = ({
    store: {
      changed: { added, removed },
    },
  }: SelectionEvent) => {
    setSelected((prev) => {
      const next = new Set(prev);
      extractIds(added).forEach((id) => next.add(id));
      extractIds(removed).forEach((id) => next.delete(id));
      return next;
    });
  };

  const onStop = ({ event, selection, store }: SelectionEvent) => {
    // console.log(selection);
    console.log(store);
  };

  useEffect(() => {
    const container: HTMLDivElement | null =
      document.querySelector(".container");
    if (container) {
      container.style.setProperty("--cols", String(cols));
      container.style.setProperty("--rows", String(rows));
    }
  }, []);

  return (
    <>
      <main className="layout">
        <SelectionArea
          className="container"
          onStart={onStart}
          onMove={onMove}
          onStop={onStop}
          selectables=".selectable"
          // document object - if you want to use it within an embed document (or iframe).
          // If you're inside of a shadow-dom make sure to specify the shadow root here.
          document={window.document}
          behaviour={{
            overlap: "invert",
            intersect: "touch",
            startThreshold: 10,
            scrolling: {
              speedDivider: 10,
              manualSpeed: 750,
              startScrollMargins: { x: 0, y: 0 },
            },
          }}
          features={{
            touch: true,
            range: true,
            singleTap: {
              allow: true,
              intersect: "native",
            },
          }}
        >
          {new Array(cols * rows).fill(0).map((_, index) => (
            <Item
              isSelected={selected.has(index)}
              index={index}
              key={index}
            ></Item>
          ))}
        </SelectionArea>
      </main>
    </>
  );
}
