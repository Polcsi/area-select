import SelectionArea, { SelectionEvent } from "@viselect/react";
import React, { useEffect, useState } from "react";
import SingleItem, { SingleItemProps } from "./SingleItem";
import "./style.css";
import { RandomHexColor } from "./utils";

interface AppProps {
  rows: number;
  cols: number;
}

interface ItemProps extends Omit<SingleItemProps, "isSelected"> {}

export default function App({ rows, cols }: AppProps) {
  const [selected, setSelected] = useState<Map<number, ItemProps>>(
    () => new Map()
  );
  const [items, setItems] = useState<Map<number, ItemProps>>(() => new Map());

  // console.log(selected);

  const extractIds = (els: Element[]): ItemProps[] =>
    els.map((v) => {
      return {
        index: Number(v.getAttribute("data-key")),
        transformation: v.getAttribute("data-fx")?.toString(),
        color: v.getAttribute("data-fxcolor")?.toString(),
      };
    });

  const onStart = ({ event, selection }: SelectionEvent) => {
    if (!event?.ctrlKey && !event?.metaKey) {
      selection.clearSelection();
      setSelected(() => new Map());
    }
  };

  const onMove = ({
    store: {
      changed: { added, removed },
    },
  }: SelectionEvent) => {
    setSelected((prev) => {
      const next = new Map(prev);

      extractIds(added).forEach((item) =>
        next.set(item.index, {
          index: item.index,
          transformation: item.transformation,
          fxColor: item.fxColor,
        })
      );
      extractIds(removed).forEach((item) => next.delete(item.index));

      return next;
    });
  };

  useEffect(() => {
    // Initialize items
    new Array(cols * rows).fill(0).map((_, index) => {
      setItems((prev) => {
        const next = new Map(prev);

        next.set(index, {
          index,
          transformation: undefined,
          fxColor: undefined,
        });

        return next;
      });
    });

    // Set the number of columns and rows in the grid
    const container: HTMLDivElement | null =
      document.querySelector(".container");

    if (container) {
      // Set the rows and cols css variables
      container.style.setProperty("--cols", String(cols));
      container.style.setProperty("--rows", String(rows));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Get the value of the input field with id="fx"
    const value: string | undefined = (
      e.target as HTMLFormElement
    ).querySelector<HTMLInputElement>("#fx")?.value;
    const rndColor = RandomHexColor();

    if (value) {
      selected.forEach((item) => {
        const el = document.querySelector(
          `.item[data-key="${item.index}"]`
        ) as HTMLDivElement;

        if (el) {
          el.setAttribute("data-fx", value);
          el.setAttribute("data-fxcolor", rndColor);
        }

        setItems((prev) => {
          const next = new Map(prev);

          next.set(item.index, {
            index: item.index,
            transformation: value,
            fxColor: rndColor,
          });

          return next;
        });
      });
    }
  };

  return (
    <>
      <header>
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="fx"
            style={{
              display: "block",
            }}
          >
            fx:
          </label>
          <input type="text" id="fx" placeholder="= x^2" autoComplete="off" />
          <button type="submit">Add</button>
        </form>
      </header>
      <main className="layout">
        <SelectionArea
          className="container"
          onStart={onStart}
          onMove={onMove}
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
          {new Array(cols * rows).fill(0).map((_, index) => {
            return (
              <SingleItem
                isSelected={selected.has(index)}
                index={index}
                key={index}
                transformation={items.get(index)?.transformation}
                fxColor={items.get(index)?.fxColor}
              ></SingleItem>
            );
          })}
        </SelectionArea>
      </main>
    </>
  );
}
