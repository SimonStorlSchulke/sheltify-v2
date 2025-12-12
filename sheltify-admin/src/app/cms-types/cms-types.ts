import { CmsArticle } from 'src/app/cms-types/article-types';


export type CmsType = {
  ID: string,
  CreatedAt?: Date,
  UpdatedAt?: Date,
  DeletedAt?: Date,
  TenantID?: string;
  Tenant?: any // TODO
  LastModifiedBy?: string,
}

export type CmsPage = CmsType & {
  Title: string,
  Path: string,
  Description: string,
  ArticleID?: string,
  Article?: CmsArticle;
  ShowInMenu: boolean,
}

export type AnimalStatusName = "in-spaichingen" | "in-bulgarien" | "vermittlungshilfe" | "zuhause-gefunden" | "vermisst" | "fundtier";

// New CMS types
export type CmsAnimal = CmsType & {
  PublishedAt?: {
    Time: string,
    Valid: boolean,
  },
  Name: string;
  Birthday?: string;
  WeightKg: number;
  ShoulderHeightCm: number;
  Castrated: boolean;
  Gender: "male" | "female";
  Description: string;
  Patrons: string;
  Status: string;
  Health: string;
  Priority: number;
  ArticleID?: string;
  Article?: CmsArticle;
  PortraitID?: string;
  Portrait?: CmsImage;
  MediaFiles: CmsImage[];
}

export type CmsImagesSize = 'thumbnail' | 'small' | 'medium' | 'large' | 'xlarge';

export type CmsImage = CmsType & {
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
  AnimalKinds: string,
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
}
