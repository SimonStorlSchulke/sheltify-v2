import { CmsImage } from 'src/app/cms-types/cms-types';

export type CmsArticle = {
  ID?: number;
  CreatedAt?: string;
  UpdatedAt?: string;
  DeletedAt?: string | null;
  Rows: CmsArticleRow[];
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
  SectionType?: string;  // could be "text" | "media"
  Position?: number;
}

export type CmsTextSection = {
  ID: number;
  HtmlContent: string;
};

export type CmsMediaSection = {
  ID: number;
  MediaFiles: CmsImage[];
};
