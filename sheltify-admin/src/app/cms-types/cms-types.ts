import { CmsArticle } from 'src/app/cms-types/article-types';


export type AnimalKind = {
  name: string,
  namePlural: string,
  article?: any[], //TODO
}


export type AnimalStatusName = "in-spaichingen" | "in-bulgarien" | "vermittlungshilfe" | "zuhause-gefunden" | "vermisst" | "fundtier";

// New CMS types
export type CmsAnimal = {
  ID?: number;
  CreatedAt?: Date;
  UpdatedAt?: Date;
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
  ArticleID?: number;
  Article?: CmsArticle;
  PortraitID?: string;
  Portrait?: CmsImage;
  TenantID: string;
  Tenant?: any //TODO
}

export type CmsImagesSize = 'thumbnail' | 'small' | 'medium' | 'large' | 'xlarge';

export type CmsImage = {
  CreatedAt: string
  UpdatedAt: string
  DeletedAt: any
  ID: string
  OriginalFileName: string
  Title: string
  Description: string
  FocusX: number
  FocusY: number
  SizesGenerated: boolean
  LargestAvailableSize: CmsImagesSize;
  MediaTags: CmsTag[]
  TenantID: string,
  Tenant?: any //TODO
  RotationSteps: 0 | 1 | 2 | 3 // each step is 90 degrees clockwise
}

export type CmsTag = {
  ID: number,
  Name: string,
  Color: string,
}

export type CmsTenantConfiguration = {
  AnimalKinds: string[],
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
