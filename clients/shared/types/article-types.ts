import type { CmsImage } from '@shared/types/cms-types.ts';

export const SectionTypes = ["title", "text", "video", "image"] as const;

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
  | SectionSeparatorY
  | SectionSeparatorX

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

export type SectionVideo = {
  SectionType: 'video',
  Content: {

  },
};

export type SectionSeparatorX = {
  SectionType: 'separator-x'
};

export type SectionSeparatorY = {
  SectionType: 'separator-y'
};
