import React from "react";
import { Poster } from "../Poster/Poster";

interface Media {
  url: string;
  name?: string;
  onClick?: () => Promise<boolean>;
}

interface ShelfProps {
  items: Media[] | undefined;
  onClick?: () => Promise<boolean>;
}

// const NOW_PLAYING = [
//   {
//     url: "https://a.ltrbxd.com/resized/film-poster/5/0/3/4/0/2/503402-mission-impossible-dead-reckoning-part-one-0-460-0-690-crop.jpg?v=800fc297c1",
//   },
//   {
//     url: "https://a.ltrbxd.com/resized/film-poster/7/7/8/1/1/7/778117-joy-ride-0-460-0-690-crop.jpg?v=9f76a25e25",
//   },
//   {
//     url: "https://a.ltrbxd.com/resized/film-poster/2/7/7/0/6/4/277064-barbie-0-230-0-345-crop.jpg?v=1b83dc7a71",
//   },
//   {
//     url: "https://a.ltrbxd.com/resized/film-poster/5/4/2/5/8/3/542583-meg-2-the-trench-0-230-0-345-crop.jpg?v=27b39483d6"
//   }
// ];

/**
 * Primary UI component for user interaction
 */
export const Shelf = ({ items, onClick }: ShelfProps) => {
  return (
    <div onClick={onClick} className="flex flex-row gap-2 w-full">
      {items?.map((item) => (
          <div onClick={item?.onClick} key={item?.url} className="w-1/5">
            <Poster size="fill" url={item?.url} progress={0} />
          </div>
        ))}
    </div>
  );
};
