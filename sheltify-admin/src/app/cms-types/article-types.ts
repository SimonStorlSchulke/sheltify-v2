import { CmsImage } from 'src/app/cms-types/cms-types';

export const SectionTypes = ["title", "text", "video", "image", "animal-list"] as const;

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

export type SectionText = {
  SectionType: 'text',
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
  },
};

export type SectionAnimalList = {
  SectionType: 'animal-list',
  Content: {
    AnimalKind: string | undefined,
    MaxNumber: number | undefined,
    AgeRange: [number | undefined, number | undefined],
    SizeRange: [number | undefined, number | undefined],
    Gender: 'male' | 'female' | 'both',
    InGermany: boolean | undefined,
  },
};

export type SectionVideo= {
  SectionType: 'video',
  Content: {

  },
};
