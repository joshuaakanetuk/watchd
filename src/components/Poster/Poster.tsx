import React from "react";
import Image from "next/image";
import { styled } from "styled-components";

const TMDB_IMAGE_PREFIX = "https://image.tmdb.org/t/p/";

interface PosterProps {
  /**
   * String url of the media image to be rendered in container.
   */
  url?: string;
  className?: string;
  /**
   * Number out of 100 to display show progress.
   */
  progress: number;
  size?: "tiny" | "shelf" | "default" | "fill";
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

const ProgressContain = styled.div<{ $progress?: number }>`
  width: ${(props) => props.$progress ?? props.$progress}%;
  display: inline-block;
  position: absolute;
  height: 4px;
  background-color: white;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: ${(props) =>
    props.$progress === 100 ? "4px" : "0px"};
  bottom: 0px;
  left: 0px;
  z-index: 1;
  //   left: 50%;
  // https://stackoverflow.com/questions/4980525/css-center-display-inline-block
  /* Calculates 50% of the element's width, and moves it by that */
  /* amount across the X-axis to the left */
  //   transform: translateX(-50%);
`;

const PosterProgress = ({ progress }: { progress: number }) => (
  <ProgressContain $progress={progress}></ProgressContain>
);

const ProgressBar = styled.div`
  display: inline-block;
  position: relative;
`;

const PosterContain = styled.div`
  position: relative;
  /* aspect-ratio: 2 / 3; */
  width: 100%;
  height: auto;
`;

const StyledSpan = styled.span`
  background-clip: padding-box;
  background-image: linear-gradient(
    90deg,
    hsla(0, 0%, 100%, 0) 0,
    hsla(0, 0%, 100%, 0.5) 50%,
    hsla(0, 0%, 100%, 0)
  );
  background-repeat: no-repeat;
  background-size: 100% 1px;
  border-radius: 4px;
  box-shadow: inset 0 0 0 1px rgba(221, 238, 255, 0.35);
  box-sizing: border-box;
  display: block;
  height: 100%;
  left: 0;
  overflow: hidden;
  position: absolute;
  right: 0;
  text-indent: 110%;
  top: 0;
  white-space: nowrap;
`;

/**
 *   "w92",
      "w154",
      "w185",
      "w342",
      "w500",
      "w780",
      "original"
 */
const SIZES = {
  tiny: {
    width: 32,
    height: 48,
    tmdb: "w92",
  },
  shelf: {
    width: 150,
    height: 225,
    tmdb: "w154",
  },
  default: {
    width: 175,
    height: 265.15,
    tmdb: "w185",
  },
};

/**
 * Primary UI component for user interaction
 */
export const Poster = ({
  progress = 0,
  size = "default",
  url,
  ...rest
}: PosterProps) => {
  if(!url) return <></>
  return (
    <div
      style={{ aspectRatio: "" }}
      className={size === "fill" ? "h-full w-full" : ""}
    >
      <PosterContain
        className={`overflow-none ${
          size === "fill" && "h-full w-full"
        } rounded`}
        {...rest}
      >
        <StyledSpan />
        {progress > 0 && progress <= 100 && (
          <PosterProgress progress={progress} />
        )}
        {size === "fill" ? (
          <Image
            className="block rounded"
            width={150}
            height={225}
            src={`${TMDB_IMAGE_PREFIX}/w185${url}`}
            alt={""}
          />
        ) : (
          <Image
            className="max-w-none rounded"
            width={SIZES[size].width}
            height={SIZES[size].height}
            src={`${TMDB_IMAGE_PREFIX}${SIZES[size].tmdb}${url}`}
            alt={""}
          ></Image>
        )}
      </PosterContain>
    </div>
  );
};
