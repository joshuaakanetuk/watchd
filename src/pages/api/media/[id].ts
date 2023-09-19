import { type NextApiRequest, type NextApiResponse } from "next";
import { TMDB } from "tmdb-ts";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";


// Initialize TMDB API Client
const tmdb = new TMDB(env.TMDB_API_KEY);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.url) return;

  const { id, type } = req.query;

  if (!id|| !type) return;

  const result = await prisma.media.findFirst({
    where: {
      tmdbId: String(id),
    },
  });

  if (!result) {
    if (type === "film") {
      const movie = await tmdb.movies.details(Number(id), ["credits"]);
      const newMovie = await prisma.media.create({
        data: {
          id: undefined,
          tmdbId: String(movie.id),
          first_released: new Date(movie.release_date),
          type: "film",
          name: movie.title,
          tagline: movie.tagline,
          backdrop: movie?.backdrop_path,
          poster: movie?.poster_path,
          overview: movie?.overview,
          runtime: movie?.runtime,
          cast: JSON.stringify(movie?.credits?.cast),
          crew: JSON.stringify(movie?.credits?.crew),
          creator: movie?.credits?.crew
            ?.filter((member) => member.job === "Director")
            .map((item) => item.name)
            .join(", "),
        },
      });
      return res.status(200).json(newMovie);
    }
  } else {
    return res.status(200).json(result);
  }
};

export default handler;
