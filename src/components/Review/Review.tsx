import React from "react";
import { Poster } from "../Poster/Poster";
import { ProfilePicture } from "../ProfilePicture/ProfilePicture";
import { Rating } from "@mui/material";

interface ReviewProps {
  /**
   * Optional click handler
   */
  onClick?: () => void;
  url?: string;
}

/**
 * Renders a review for media with either the media attached or
 * highlighting the author who created the review.
 */
export const Review = ({ onClick, url }: ReviewProps) => {
  return (
    <div>
      <div className="flex flex-row gap-3 py-4">
        <Poster size="tiny" className="grow-0" url={url} progress={0} />
        <div className="flex flex-col text-white">
          <div>
            <span className="text-lg font-bold">Title</span>
            <span className="ml-1 font-light text-gray-400">(Year)</span>
          </div>
          <div className="flex flex-row items-center gap-2 py-2">
            <div className="flex flex-row items-center gap-1 text-sm font-semibold text-gray-400">
              <ProfilePicture size={"tiny"} url={undefined} /> author{" "}
            </div>
            <Rating size={"small"} value={4} readOnly />
          </div>
          <div className="py-1 font-serif">
            <p>CONTENTKJSDKLHAJSKJD HKJASHD KJASHD KJASH DKASHKD</p>{" "}
          </div>
        </div>
      </div>
    </div>
  );
};
