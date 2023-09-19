interface Person {
	id: number;
	name: string;
	profile_path: string;
	adult: boolean;
	popularity: number;
	known_for: Array<TMDBMovie | TMDBShow>;
}

interface TMDBMovie {
    adult: boolean;
    backdrop_path: string;
    belongs_to_collection: Collection;
    budget: number;
    genre_ids: number[];
    genres: Genre[];
    homepage: string;
    id: number;
    imdb_id: string;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    production_companies: Company[];
    production_countries: Country[];
    release_date: Date;
    revenue: number;
    runtime: number;
    spoken_languages: Language[];
    status: string;
    tagline: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
  }
  
  interface TMDBShow {
    backdrop_path: string;
    created_by: Person[];
    episode_run_time: number[];
    first_air_date: Date;
    genre_ids: number[];
    genres: Genre[];
    homepage: string;
    id: number;
    in_production: boolean;
    languages: string[];
    last_air_date: Date;
    name: string;
    networks: Network[];
    number_of_episodes: number;
    number_of_seasons: number;
    origin_country: string[];
    original_language: string;
    original_name: string;
    overview: string;
    popularity: number;
    poster_path: string;
    production_companies: Company[];
    seasons: Season[];
    status: string;
    tagline: string;
    type: string;
    vote_average: number;
    vote_count: number;
  }
  
  // interface Media {
  //   id?: string | null; // String (assuming the ID is a string)
  //   name: string; // String (assuming the name is a string)
  //   type: string; // String (assuming the type is a string)
  //   backdrop?: string | null; // Optional string or null
  //   overview?: string | null; // Optional string or null
  //   first_released: Date | null; // Optional Date object or null
  //   last_released?: Date | null; // Optional Date object or null
  //   runtime?: number | null; // Optional number or null
  //   number_of_episodes?: number | null; // Optional number or null
  //   number_of_seasons?: number | null; // Optional number or null
  //   poster?: string | null; // Optional string or null
  //   tagline: string; // String (assuming the tagline is a string)
  //   tmdbId: string; // String (assuming the tmdbId is a string)
  // }
  
interface SearchResult {
    page: number;
    results: Array<TMDBMovie> | Array<TMDBShow>;
    total_results: number;
    total_pages: number;
  }