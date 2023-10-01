import React from "react";
import { Poster } from "../Poster/Poster";
import { ProfilePicture } from "../ProfilePicture/ProfilePicture";
import { Rating } from "@mui/material";

const USERS = [
  "FilmFanatic123",
  "CinephileJourney",
  "MovieBuff85",
  "ReelReviewer",
  "PopcornPundit",
];

const REVIEWS = [
  "Incredible storytelling and breathtaking visuals make this film a must-see. The characters are well-developed, and the plot keeps you on the edge of your seat.",
  "A cinematic masterpiece! The director's vision shines through every frame, and the performances are Oscar-worthy. This film will leave you thinking long after the credits roll.",
  "A fun and entertaining movie that's perfect for a night out with friends. The humor is spot-on, and the action sequences are exhilarating.",
  "A thought-provoking and emotionally charged film that tackles important themes. The performances are top-notch, and the ending will leave you in tears.",
  "A unique and visually stunning experience that pushes the boundaries of filmmaking. The soundtrack is hauntingly beautiful, and the story will stick with you.",
  "An enjoyable and lighthearted film that's perfect for a lazy Sunday afternoon. The chemistry between the lead actors is palpable, and the humor is infectious.",
  "A gripping and suspenseful thriller that will keep you guessing until the very end. The plot twists are well-executed, and the tension is palpable.",
  "A heartwarming and feel-good movie that's perfect for a family night in. The characters are endearing, and the message of the film is uplifting.",
  "A mind-bending and intellectually stimulating film that challenges the viewer's perception of reality. The cinematography is stunning, and the plot is full of surprises.",
  "A solid addition to the franchise that fans will love. The action sequences are pulse-pounding, and the nostalgia factor is high.",
];

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
          <div className="flex flex-row items-center gap-2 py-2">
            <div className="flex flex-row items-center gap-1 text-sm font-semibold text-gray-400">
              <ProfilePicture size={"tiny"} url={undefined} />{USERS[Math.floor(Math.random() * USERS.length)]}
            </div>
            <Rating size={"small"} value={Math.floor(Math.random() * 5)} readOnly />
          </div>
          <div className="py-1 font-serif">
            <p>{REVIEWS[Math.floor(Math.random() * REVIEWS.length)]}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
