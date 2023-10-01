import React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { type Cast, type Crew } from "tmdb-ts";

interface MediaDetailProps {
  title: string;
  year: number | `${number}`;
  creators: string;
  tagline?: string;
  description: string;
  cast?: Cast[];
  crew?: Crew[];
  type: "movie" | "show";
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
export const MediaDetail = ({
  title = "Mission: Impossible – Dead Reckoning Part One",
  year = 2012,
  type = "movie",
  creators,
  cast,
  crew,
  tagline,
  description = "Ethan Hunt and his IMF team embark on their most dangerous mission yet: To track down a terrifying new weapon that threatens all of humanity before it falls into the wrong hands. With control of the future and the fate of the world at stake, and dark forces from Ethan’s past closing in, a deadly race around the globe begins. Confronted by a mysterious, all-powerful enemy, Ethan is forced to consider that nothing can matter more than his mission – not even the lives of those he cares about most.",
  onClick,
}: MediaDetailProps) => {
  return (
    <div className="flex flex-col gap-3 text-white relative">
      <div className="flex flex-col gap-3">
        <h1 className="font-[Lora] text-6xl font-bold">{title}</h1>
        <div className="inline-flex items-center gap-2">
          <span className="inline-block rounded-md bg-blue-100 px-2 py-1 align-middle text-xs font-semibold text-blue-700">
            {year}
          </span>
          <div>
            {type === "movie" ? `Directed` : `Created`} by {creators}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {tagline && <div className="text-xs">{tagline}</div>}
        {description && <p>{description}</p>}
      </div>
      <div>
        <Tabs.Root defaultValue={"tab1"} className="w-full">
          <Tabs.List className="grid w-full grid-cols-2 justify-center rounded-lg bg-[rgb(39,39,42)] p-1">
            <Tabs.Trigger
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-black"
              value="tab1"
            >
              Cast
            </Tabs.Trigger>
            <Tabs.Trigger
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-black"
              value="tab2"
            >
              Crew
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content className="pt-3 flex flex-row flex-wrap gap-2" value="tab1">
            {cast?.slice(0, 20).map((member) => (
              <span key={member?.name} className="rounded text-sm bg-[#283038] px-1 py-1 shadow">
                {member?.name}
              </span>
            ))}
          </Tabs.Content>
          <Tabs.Content className="pt-3 flex flex-row flex-wrap gap-2" value="tab2">
          {crew?.slice(0, 20).map((member) => (
              <span key={member.id} className="rounded text-sm bg-[#283038] px-1 py-1 shadow">
                {member?.name}
              </span>
            ))}
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
};
