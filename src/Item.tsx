import React from "react";

interface ItemProps {
  isSelected: boolean;
  index: number;
}

const Item = ({ isSelected, index }: ItemProps) => {
  return (
    <div
      className={`${isSelected ? "selected selectable" : "selectable"} item`}
      data-key={index}
      key={index}
    />
  );
};

export default Item;
