import type { StrapiMedia } from 'types/strapi-media.ts';

export type Animal = {
  id: number;
  documentId: string;
  updatedAt: string;
  publishedAt: string;
  name: string;
  race?: string;
  gender: "male" | "female" | "other";
  description: string;
  paten: string;
  emergency?: boolean;
  whereInGermany?: string;
  castrated?: boolean | null;
  shoulderHeightCm?: number;
  weightKg?: number | null;
  animalKind?: string | null;
  birthday?: string | null;
  diseases?: string | null;
  tolerating?: string | null;
  suitedFor?: string | null;
  priority: number;
  status: string;
  freeRoamer?: boolean;
  animal_article?: {
    updatedAt: string;
  };
  thumbnail?: StrapiMedia;
};
