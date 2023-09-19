import React, { useState } from "react";
import { Reorder } from "framer-motion";
import { Poster } from "../Poster/Poster";
import { XMarkIcon } from "@heroicons/react/20/solid";

interface EditableListProps {
  items: string[];
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
export const EditableList = ({ onClick }: EditableListProps) => {
  const [items, setItems] = useState(["Fight Club", "Chef", "Frances Ha", 3]);

  const removeElementByIndex = (index: number) => {
    const newArray = [...items];
    newArray.splice(index, 1);
    setItems(newArray);
  };

  return (
    <Reorder.Group axis="y" values={items} onReorder={setItems} className="flex flex-col space-y-3">
      {items.map((item, index) => (
        <Reorder.Item key={item} value={item}>
          <div className="overflow-hidden text-black flex flex-row bg-white shadow rounded py-2 px-2">
            <Poster progress={0} size="tiny" />{" "}
            <div className="ml-1  grow font-semibold">{item} </div>
            <div className="justify-self-end flex flex-col justify-center	" onClick={() => removeElementByIndex(index)}>
              <XMarkIcon className="w-6 h-6  " />
            </div>
          </div>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
};
