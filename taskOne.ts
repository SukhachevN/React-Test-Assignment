import fetch from 'node-fetch';

(async () => {
  const baseUrl = 'https://rickandmortyapi.com/api/episode';

  interface EpisodeResult {
    id: number;
    name: string;
    air_date: string;
    episode: string;
    characters: string[];
    url: string;
    created: string;
  }

  interface Character {
    id: number;
    name: string;
    status: 'Alive' | 'Dead' | 'unknown';
    species: string;
    type: string;
    gender: 'Female' | 'Male' | 'Genderless' | 'unknown';
    origin: string;
    location: string;
    image: string;
    episode: string[];
    url: string;
    created: string;
  }

  interface EpisodesWithCharacters extends Omit<EpisodeResult, 'characters'> {
    characters: Character[];
  }

  interface Info {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  }

  interface EpisodeResponse {
    info: Info;
    results: EpisodeResult[];
  }

  const getResponse = async <T>(url: string): Promise<T> => {
    const response = await fetch(url);

    const result = await response.json();

    return result as Promise<T>;
  };

  const getAllEpisodes = async (): Promise<EpisodeResult[]> => {
    try {
      const episodes: EpisodeResult[] = [];

      let nextUrl: string | null = baseUrl;

      while (nextUrl) {
        const {
          info: { next },
          results,
        }: EpisodeResponse = await getResponse(nextUrl);

        episodes.push(...results);
        nextUrl = next;
      }

      return episodes;
    } catch (e) {
      return [];
    }
  };

  const mutateCharacters = async (
    episodes: EpisodeResult[]
  ): Promise<EpisodesWithCharacters[]> => {
    try {
      const mutated: EpisodesWithCharacters[] = [];

      for (const episode of episodes) {
        const mutatedEpisode: EpisodesWithCharacters = {
          ...episode,
          characters: [],
        };

        for (const characterLink of episode.characters) {
          const character: Character = await getResponse(characterLink);

          mutatedEpisode.characters.push(character);
        }
        mutated.push(mutatedEpisode);
      }

      return mutated;
    } catch (e) {
      return [];
    }
  };

  const episodes = await getAllEpisodes();

  const mutatedEpisodes: EpisodesWithCharacters[] = await mutateCharacters(
    episodes
  );

  console.log(mutatedEpisodes);
})();
