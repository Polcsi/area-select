import { Tooltip } from "react-tooltip";

export interface SingleItemProps {
  isSelected: boolean;
  index: number;
  transformation?: string;
  fxColor?: string;
}

const SingleItem = ({
  isSelected,
  index,
  transformation,
  fxColor = "#570453",
}: SingleItemProps) => {
  return (
    <>
      <article
        key={index}
        className={`${isSelected ? "selected selectable" : "selectable"} item`}
        data-key={index}
        data-fx={transformation}
        data-fxcolor={fxColor}
        data-tooltip-id={`${index}-item-tooltip`}
        data-tooltip-content={`Item: ${index} - Transformation: ${transformation}`}
      >
        {transformation ? (
          <div
            className="item-fx"
            style={{
              backgroundColor: fxColor,
            }}
          >
            fx
          </div>
        ) : null}
      </article>
      <Tooltip id={`${index}-item-tooltip`} />
    </>
  );
};

export default SingleItem;
