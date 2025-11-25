import { CmsImage } from 'src/app/cms-types/cms-types';

export const SectionTypes = ["title", "text", "video", "image"];

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
  ID?: number;
  ArticleID?: number;
  Position?: number;
  Sections: CmsArticleSectionRef[];
};

export type CmsArticleSectionRef = {
  ID?: number;
  ArticleRowID?: number;
  SectionID?: number;
  SectionType?: SectionType;  // could be "text" | "media"
  Position?: number;
}

export type CmsTextSection = {
  ID?: number;
  HtmlContent: string;
};

export type CmsMediaSection = {
  ID?: number;
  MediaFiles: CmsImage[];
};
