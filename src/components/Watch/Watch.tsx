import React from "react";
import { Poster } from "../Poster/Poster";
import { HeartIcon } from "@heroicons/react/20/solid";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { format } from "date-fns";

interface WatchProps {
  /**
   * Date of watch
   */
  date: Date;
  /**
   * The image url
   */
  image: string;
  /**
   *
   */
  title: string;
  /**
   * Event fired when film is liked.
   */
  onLikedClick?: () => void;
}

// MONTH	DAY	FILM	RELEASED	RATING	LIKE	REWATCH	REVIEW	EDIT

// Date
// Day
// Image
// Title
// Year Finished
// Rating
// Liked?

/**
 * Primary UI component for user interaction
 */
export const Watch = ({ onLikedClick, date, title, image }: WatchProps) => {
  return (
    <div className="flex w-full flex-row items-center gap-2 text-white">
      {/* DATE */}
      <div className="mr-5 w-[100px!important]">{format(new Date(date), 'PP')}</div>
      <Poster className="mr-5 w-[32px!important]" url={image} size="tiny" progress={0} />
      {/* TITLE: BOLD */}
      <div className="mr-5 flex-grow max-w-full">{title}</div>
      {/* TITLE: MID-GRAY / THIN */}
      <div className="px-5 justify-self-end">
        {false ? (
          <HeartIcon onClick={onLikedClick} className="h-4 w-4" />
        ) : (
          <HeartOutline onClick={onLikedClick} className="h-4 w-4" />
        )}
      </div>
    </div>
  );
};
