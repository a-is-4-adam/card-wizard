import { cards as baseSet } from "./baseSet";
import { cards as gymChallenge } from "./gymChallenge";
import { cards as gymHeroes } from "./gymHeroes";
import { cards as jungle } from "./jungle";

type Base = {
  name: string;
  slug: string;
};

type Card = Base & {
  img: string;
};

type Release = Base & {
  cards: Array<Card>;
};

type Series = Base & {
  disabled?: boolean;
  releases: Array<Release>;
};

type Brand = Base & {
  series: Array<Series>;
};

export const cards: Array<Brand> = [
  {
    name: "Pokemon",
    slug: "pokemon",
    series: [
      {
        name: "Base Set",
        slug: "base-set",
        releases: [
          {
            name: "Base Set",
            slug: "base-set",
            cards: baseSet,
          },
          {
            name: "Jungle",
            slug: "jungle",
            cards: jungle,
          },
        ],
      },
      {
        name: "Gym Heroes",
        slug: "gym-heroes",
        releases: [
          {
            name: "Gym Heroes",
            slug: "gym-heroes",
            cards: gymHeroes,
          },
          {
            name: "Gym Challenge",
            slug: "gym-challenge",
            cards: gymChallenge,
          },
        ],
      },
    ],
  },
  {
    name: "Yu-gi-oh",
    slug: "yu-gi-oh",
    series: [
      {
        name: "Yu-gi-oh cards not supported yet",
        slug: "empty",
        disabled: true,
        releases: [],
      },
    ],
  },
];
