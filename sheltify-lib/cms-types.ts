import { CmsArticle } from './article-types';

export type SqlNullTime = {
  Time: string | null,
  Valid: boolean,
}

export type SqlNullBool = {
  Bool:  boolean,
  Valid: boolean, // Valid is true if Bool is not NULL
}

export const SqlNullBoolNull: SqlNullBool = {Bool: false, Valid: false}
export const SqlNullBoolTrue: SqlNullBool = {Bool: true, Valid: true}
export const SqlNullBoolFalse: SqlNullBool = {Bool: false, Valid: true}

export type CmsType = {
  ID: string,
  CreatedAt?: Date,
  UpdatedAt?: Date,
  DeletedAt?: Date,
  TenantID?: string;
  LastModifiedBy?: string,
}

export type CmsPage = Publishable & {
  Path: string,
  Description: string,
  ArticleID?: string,
  Article?: CmsArticle;
  ShowInMenu: boolean,
  LinkInFooter: boolean,
  Priority: number,
}

export type Publishable = CmsType & {
  PublishedAt?: SqlNullTime,
}

export type AnimalStatusName = "in-spaichingen" | "in-bulgarien" | "vermittlungshilfe" | "zuhause-gefunden" | "vermisst" | "fundtier";

// New CMS types
export type CmsAnimal = Publishable & {
  Name: string;
  AnimalKind?: string,
  Birthday?: string;
  WeightKg: number;
  ShoulderHeightCm: number;
  Castrated: SqlNullBool;
  Gender: '' | 'male' | 'female';
  Description: string;
  Where: string,
  Patrons: string;
  Status: string;
  Health: string;
  Priority: number;
  ArticleID?: string;
  Article?: CmsArticle;
  PortraitID?: string;
  Portrait?: CmsImage;
  MediaFiles: CmsImage[];
  NoAdoption: boolean,
  FreeRoamer: SqlNullBool,
  HomeFoundStatus: 'no' | 'reserved' | 'yes',
}

export type CmsHomeFoundEntry = CmsType & {
  AnimalName: string,
  Content: {
    Html:       string
    MediaFiles: CmsImage[],
  }
}

export type CmsTeamMember = CmsType & {
  Name:        string,
  Role:        string,
  Description: string,
  Priority: number,
  EMail:       string,
  Phone:       string,
  PortraitID?: string;
  Portrait?: CmsImage;
}

export type CmsImagesSize = 'thumbnail' | 'small' | 'medium' | 'large' | 'xlarge';

export type CmsImage = CmsType & {
  NonImage?: boolean, // this is horrible but won't fix
  OriginalFileName: string
  Title: string
  Description: string
  FocusX: number
  FocusY: number
  SizesGenerated: boolean
  LargestAvailableSize: CmsImagesSize;
  MediaTags: CmsTag[],
  TaggedAnimals: CmsAnimal[],
  RotationSteps: 0 | 1 | 2 | 3 // each step is 90 degrees clockwise
}

export type CmsTag = CmsType & {
  Name: string,
  Color: string,
}

export type CmsTenantConfiguration = CmsType & {
  Name: string,
  SiteUrl: string,
  AnimalKinds: string,
  BlogCategories: string,
  DefaultAnimalKind: string,
  CmsShowAnimalKindSelector: boolean,
  Address: string,
  PhoneNumber: string,
  Email: string,
  ArticleCss: string,
  IBAN: string,
  LinkPaypal: string,
  LinkFacebook: string,
  LinkInstagram: string,
  LinkTiktok: string,
  LinkYoutube: string,
  LogoHeaderID?: string,
  LogoHeader?: CmsImage,
  LastBuild?: SqlNullTime,
  NeedsRebuild: boolean,
  AnimalFeatureWhere: boolean,
  AnimalFeaturePatrons: boolean,
  AnimalFeatureRace: boolean,
  AnimalFeatureAnimalKind: boolean,
  AnimalFeatureNoAdoption: boolean,
}

export type CmsBlogEntry = Publishable & {
  Title: string,
  Category: string,
  Description: string,
  ShowPopup: boolean,
  ThumbnailID?: string,
  Thumbnail?: CmsImage,
  ArticleID?: string;
  Article?: CmsArticle;
}
