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
    characters: (Character | null)[];
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

  const getResponse = () => {
    const cache: Record<string, any> = {};

    return async <T>(url: string): Promise<T | null> => {
      try {
        if (cache[url]) return cache[url] as Promise<T>;

        const response = await fetch(url);
        const result = await response.json();

        cache[url] = result;

        return result as Promise<T>;
      } catch (e) {
        /* sometimes api fails with 429 status, becouse of so much requests, to avoid it i need catch error here, i tried fix it by adding cache to avoid extra api calls, but sometimes it still fails. */
        return null;
      }
    };
  };

  const fetchApi = getResponse();

  const getAllEpisodes = async (): Promise<EpisodeResult[]> => {
    try {
      const episodes: EpisodeResult[] = [];

      let nextUrl: string | null = baseUrl;

      while (nextUrl) {
        const response: EpisodeResponse | null = await fetchApi(nextUrl);
        if (response) {
          const {
            info: { next },
            results,
          } = response as EpisodeResponse;
          episodes.push(...results);
          nextUrl = next;
        }
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
      /* important note: api sometimes fails with 429 status, becouse of so much requests, when api fails i return null */
      const mutated = await Promise.all(
        episodes.map(async (episode) => {
          const characters: (Character | null)[] = await Promise.all(
            episode.characters.map((link) => fetchApi<Character>(link))
          );

          return { ...episode, characters };
        })
      );

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
