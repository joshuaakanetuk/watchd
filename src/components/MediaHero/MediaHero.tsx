import React from "react";
import styled from "styled-components";

const TMDB_POSTER = "https://image.tmdb.org/t/p/w1280";

interface MediaHeroProps {
  url: string;
  children?: React.ReactNode;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

const StyledMediaHero = styled.div`
  height: 675px;
  position: relative;
  width: 100%;
`;

const StyledBackdropContain = styled.div`
  height: 675px;
  position: absolute;
  width: 100%;
  background-repeat: no-repeat;
  background-position: center 0px;
  background-size: cover;
  background-image: linear-gradient(
      90deg,
      #14181d 0,
      rgba(20, 24, 29, 0.986) 0.97%,
      rgba(20, 24, 29, 0.945) 2.07833333%,
      rgba(20, 24, 29, 0.883) 3.29666667%,
      rgba(20, 24, 29, 0.803) 4.60166667%,
      rgba(20, 24, 29, 0.711) 5.96666667%,
      rgba(20, 24, 29, 0.61) 7.365%,
      rgba(20, 24, 29, 0.504) 8.77166667%,
      rgba(20, 24, 29, 0.398) 10.16%,
      rgba(20, 24, 29, 0.296) 11.505%,
      rgba(20, 24, 29, 0.203) 12.78%,
      rgba(20, 24, 29, 0.122) 13.95833333%,
      rgba(20, 24, 29, 0.059) 15.01666667%,
      rgba(20, 24, 29, 0.016) 15.92833333%,
      rgba(20, 24, 29, 0) 16.66666667%,
      rgba(20, 24, 29, 0) 83.33333333%,
      rgba(20, 24, 29, 0.016) 84.07166667%,
      rgba(20, 24, 29, 0.059) 84.98333333%,
      rgba(20, 24, 29, 0.122) 86.04166667%,
      rgba(20, 24, 29, 0.203) 87.22%,
      rgba(20, 24, 29, 0.296) 88.495%,
      rgba(20, 24, 29, 0.398) 89.84%,
      rgba(20, 24, 29, 0.504) 91.22833333%,
      rgba(20, 24, 29, 0.61) 92.635%,
      rgba(20, 24, 29, 0.711) 94.03333333%,
      rgba(20, 24, 29, 0.803) 95.39833333%,
      rgba(20, 24, 29, 0.883) 96.70333333%,
      rgba(20, 24, 29, 0.945) 97.92166667%,
      rgba(20, 24, 29, 0.986) 99.03%,
      #14181d
    ),
    linear-gradient(
      0deg,
      #14181d 0,
      #14181d 21.48148148%,
      rgba(20, 24, 29, 0.986) 23.63703704%,
      rgba(20, 24, 29, 0.945) 26.1%,
      rgba(20, 24, 29, 0.883) 28.80740741%,
      rgba(20, 24, 29, 0.803) 31.70740741%,
      rgba(20, 24, 29, 0.711) 34.74074074%,
      rgba(20, 24, 29, 0.61) 37.84814815%,
      rgba(20, 24, 29, 0.504) 40.97407407%,
      rgba(20, 24, 29, 0.398) 44.05925926%,
      rgba(20, 24, 29, 0.296) 47.04814815%,
      rgba(20, 24, 29, 0.203) 49.88148148%,
      rgba(20, 24, 29, 0.122) 52.5%,
      rgba(20, 24, 29, 0.059) 54.85185185%,
      rgba(20, 24, 29, 0.016) 56.87777778%,
      rgba(20, 24, 29, 0) 58.51851852%
    );
`;

const StyledBackdropImage = styled.div<{ $url?: string }>`
  height: 675px;
  position: relative;
  width: 100%;
  background-repeat: no-repeat;
  background-position: center 0px;
  background-size: cover;
  position: absolute;
  background-color: #141414;
  background-image: ${(props) =>
    props?.$url
      ? `url("${props?.$url}")`
      : `url("https://a.ltrbxd.com/resized/sm/upload/22/gj/k3/ql/spider-verse-1920-1920-1080-1080-crop-000000.jpg?v=259dfdc695")`};
`;

/**
 * Renders an backdrop for a piece of media as retrieved from TMDB.
 * Typically gives a gist of the content detailed.
 */
export const MediaHero = ({ children, url }: MediaHeroProps) => {
  return (
    <StyledMediaHero className="m-auto flex h-[675px] w-full max-w-5xl flex-col items-center  overflow-hidden">
      <StyledBackdropImage $url={TMDB_POSTER + url} />
      <StyledBackdropContain />
      {children && (
        <div className="absolute bottom-0 z-10 mx-auto flex flex-row items-center gap-7">
          {children}
        </div>
      )}
    </StyledMediaHero>
  );
};
