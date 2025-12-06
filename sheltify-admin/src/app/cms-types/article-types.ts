import { CmsAnimal, CmsImage } from 'src/app/cms-types/cms-types';
import { AnimalsFilter } from 'src/app/services/cms-request.service';

export const SectionTypes = ["title", "text", "video", "image", "animal-list", "html", "separator-x"] as const;

export type SectionType = (typeof SectionTypes)[number];

export type CmsArticle = {
  ID?: number;
  CreatedAt?: string;
  UpdatedAt?: string;
  DeletedAt?: string | null;
  TenantID: string;
  Structure: {
    Rows: CmsArticleRow[];
  }
};

export type CmsArticleRow = {
  Sections: Section[];
};

export type Section =
  | SectionText
  | SectionImages
  | SectionTitle
  | SectionVideo
  | SectionAnimalList
  | SectionHtml
  | SectionSeparatorX

export type SectionText = {
  SectionType: 'text',
  Content: {
    Html: string;
  },
};

export type SectionHtml = {
  SectionType: 'html',
  Content: {
    Html: string;
  },
};

export type SectionImages = {
  SectionType: 'image',
  Content: {
    MediaFiles: CmsImage[];
  },
};

export type SectionTitle = {
  SectionType: 'title',
  Content: {
    Text: string,
    Type: 'h1' | 'h2' | 'h3' | 'h4',
    Anchor: string,
    Underline?: boolean,
  },
};

export type SectionAnimalList = {
  SectionType: 'animal-list',
  Content: AnimalsFilter,
  TempFoundAnimals: CmsAnimal[],
};

export type SectionVideo= {
  SectionType: 'video',
  Content: {

  },
};

export type SectionSeparatorX = {
  SectionType: 'separator-x'
};

