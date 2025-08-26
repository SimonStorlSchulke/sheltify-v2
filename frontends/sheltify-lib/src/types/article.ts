import type { RichTextNode } from "src/access/blockRenderer";
import type { Animal } from "src/types/animal";
import type { StrapiMedia } from "src/types/strapi-media";

export type ArticleSection =
  | ArticleTextSection
  | ArticleTextWithImageSection
  | ArticleHeroSection
  | ArticleAnimalCardsSection
  | ArticleRowStartSection
  | ArticleBlogCardsSection
  | ButtonLinkSection
  | ArticleImageSection
  | SectionStartSection
  | ArticlePaypalButtonSection
  | ArticleCounterSection
  | FileSection;


export type ArticleRowStartSection = {
  __component: 'article-section.row-start';
  title: string;
  background?: "nein" | "grün" | "beige";
  columns: number;
  textCentered: boolean;
};

export type ArticleTextWithImageSection = {
  __component: 'article-section.text-with-image-section';
  background?: "nein" | "grün" | "beige";
  text: RichTextNode[];
  images?: StrapiMedia[];
  imagePosition: 'oben' | 'rechts' | 'links' | 'unten';
  gallery: boolean;
};

export type ArticleHeroSection = {
  __component: 'article-section.hero';
  background?: "nein" | "grün" | "beige";
  hero: StrapiMedia;
};

export type ArticleAnimalCardsSection = {
  __component: 'article-section.animal-cards';
  text: RichTextNode[];
  background?: "nein" | "grün" | "beige";
  animals: Animal[];
  filteredAmount?: number,
};

export type ArticleTextSection = {
  __component: 'article-section.text';
  background?: "nein" | "grün" | "beige";
  text: RichTextNode[];
};

export type ArticleBlogCardsSection = {
  __component: 'article-section.news-cards';
  background?: "nein" | "grün" | "beige";
  amount: number,
  type: string,
};

export type ButtonLinkSection = {
  __component: 'article-section.button-link';
  background?: "nein" | "grün" | "beige";
  text: string;
  link: string;
  type: 'primary' | 'secondary' | 'call-to-action';
};

export type ArticleImageSection = {
  __component: 'article-section.image';
  background?: "nein" | "grün" | "beige";
  images: StrapiMedia[];
  gallery: boolean;
};

export type SectionStartSection = {
  __component: 'article-section.section-start';
  title?: string;
  background?: "nein" | "grün" | "beige";
};

export type ArticlePaypalButtonSection = {
  __component: 'article-section.paypal-button';
  background?: "nein" | "grün" | "beige";
};

export type ArticleCounterSection = {
  __component: 'article-section.counter';
  background?: "nein" | "grün" | "beige";
  title: string;
  subtitle: string;
  counter: number;
};

export type FileSection = {
  __component: 'article-section.file';
  background?: "nein" | "grün" | "beige";
  Datei: {
    url: string,
    name: string,
    size: number,
    ext: string,
  };
};
