import { type Media } from "@prisma/client";
import React from "react";
import { Poster } from "../Poster/Poster";
import Image from "next/image";
import { Router, useRouter } from "next/router";

const BASE_IMAGE_PREFIX = "https://image.tmdb.org/t/p/w342";

interface ListProps {
  id: string;
  items: Media[];
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

const spanStyle = {
  backgroundClip: "padding-box",
  backgroundImage:
    "linear-gradient(90deg, hsla(0, 0%, 100%, 0) 0, hsla(0, 0%, 100%, 0.5) 50%, hsla(0, 0%, 100%, 0))",
  backgroundRepeat: "no-repeat",
  backgroundSize: "100% 1px",
  borderRadius: "4px",
  boxShadow: "inset 0 0 0 1px rgba(221, 238, 255, 0.35)",
  boxSizing: "border-box" as const,
  display: "block",
  height: "100%",
  left: "0",
  overflow: "hidden",
  position: "absolute" as const,
  right: "0",
  textIndent: "110%",
  top: "0",
  whiteSpace: "nowrap" as const,
};

/**
 * Primary UI component for user interaction #161718
 */
export const List = ({ items, onClick, id }: ListProps) => {
  const router = useRouter();
  const maxItems = items?.slice(0, 5);
  return (
    <div
      onClick={() => void router.push("/lists/" + id)}
      className="grid grid-cols-5 gap-1 rounded outline cursor-pointer"
    >
      {maxItems?.map((item, index) => {
        const zIndex = 10 - index;
        return (
          <Image
            key={item.id}
            className={"relative rounded"}
            style={{ zIndex }}
            width={70}
            height={105}
            alt={item.name}
            src={BASE_IMAGE_PREFIX + item.poster}
          />
        );
      })}
    </div>
  );
};
