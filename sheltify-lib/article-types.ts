import { CmsAnimal, CmsImage, CmsType, SqlNullTime } from './cms-types';

export const SectionTypes = ["title", "text", "video", "image", "hero", "animal-list", "html", "separator-x", "home-found", "columns"] as const;

export type SectionType = (typeof SectionTypes)[number];

export type CmsArticle = CmsType & {
  CreatedAt?: string;
  UpdatedAt?: string;
  DeletedAt?: string | null;
  TenantID: string;
  Structure: {
    Rows: Section[];
  }
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
  | SectionHomeFound
  | SectionColumns

export type SectionColumns = {
  SectionType: 'columns',
  Content: {
    FullWidth: boolean,
    Columns: {
      Sections: Section[],
      Grow: number,
    }[]
  },
};

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
    Layout: 'vertical' | 'horizontal' | 'gallery',
    MediaFiles: CmsImage[];
  },
};

export type SectionHero = {
  SectionType: 'hero',
  Content: {
    Text: string;
    MediaFiles: CmsImage[];
    DurationSeconds?: number;
  },
};

export type SectionTitle = {
  SectionType: 'title',
  Content: {
    Text: string,
    Type: 'h1' | 'h2' | 'h3' | 'h4',
    Anchor: string,
    Underline?: boolean,
    Centered: boolean,
  },
};

export type SectionAnimalList = {
  SectionType: 'animal-list',
  Content: AnimalsFilter,
  TempFoundAnimals: CmsAnimal[],
};

export type SectionHomeFound = {
  SectionType: 'home-found',
  Content: {
    From: Date | undefined,
    To: Date |undefined,
  }
};

export type AnimalsFilter = {
  AnimalKind: string | undefined,
  MaxNumber: number | undefined,
  AgeRange: [number | undefined, number | undefined],
  SizeRange: [number | undefined, number | undefined],
  Gender: 'male' | 'female' | 'both',
  InGermany: boolean | undefined,
  Names: string | undefined,
}

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
