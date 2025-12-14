import { CmsAnimal, CmsImage, CmsType } from 'src/app/cms-types/cms-types';
import { AnimalsFilter } from 'src/app/services/cms-request.service';

export const SectionTypes = ["title", "text", "video", "image", "hero", "animal-list", "html", "separator-x"] as const;

export type SectionType = (typeof SectionTypes)[number];

export type CmsArticle = CmsType & {
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
  | SectionHero

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

export type SectionHero = {
  SectionType: 'hero',
  Content: {
    Text: string;
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

export type SectionVideo = {
  SectionType: 'video',
  Content: {
    Title: string,
    Url: string,
  },
};

export type SectionSeparatorX = {
  SectionType: 'separator-x'
};

