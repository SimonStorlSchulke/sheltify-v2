export type StrapiMedia = {
  id: number
  name: string
  alternativeText: string
  caption?: string
  width: number
  height: number
  formats?: {
    thumbnail: {
      url: string
    },
    small?: {
      url: string
    },
    medium?: {
      url: string
    },
    large?: {
      url: string
    },
    xlarge?: {
      url: string
    },
  }
  hash: string
  ext: string
  mime: string
  size: number
  url: string
  previewUrl: any
  provider: string
  provider_metadata: any
  createdAt: string
  updatedAt: string
}

export type StrapiPagination = {
  page: number
  pageSize: number
  pageCount: number
  total: number
}

export type StrapiFilter = {
  field: string,
  operator?:
    "eq" | "eqi" | "ne" | "nei"
    | "lt" | "lte" | "gt" | "gte" | "in"
    | "notIn" | "contains" | "notContains" | "containsi"
    | "notContainsi" | "null" | "notNull" | "between"
    | "startsWith" | "startsWithi" | "endsWith" | "endsWithi"
    | "or" | "and" | "not",
  value: string,
}

export type AnimalKind = {
  name: string,
  namePlural: string,
  icon: StrapiMedia,
  article?: any[], //TODO
}

export type Animal = {
  id: number,
  documentId: string,
  updatedAt: string,
  publishedAt: string,
  name: string,
  gender: "male" | "female" | "other";
  thumbnail?: StrapiMedia | null,
  description: string,
  paten: string,
  emergency?: boolean,
  whereInGermany?: string,
  castrated?: boolean | null,
  shoulderHeightCm?: number,
  weightKg?: number | null,
  animalKind?: AnimalKind | null,
  birthday?: string | null,
  diseases?: string | null,
  tolerating?: string | null,
  suitedFor?: string | null,
  priority: number,
  status: AnimalStatusName;
  animal_article?: {
    updatedAt: string,
  }
}

export type AnimalStatusName = "in-spaichingen" | "in-bulgarien" | "vermittlungshilfe" | "zuhause-gefunden" | "vermisst" | "fundtier";

// New CMS types
export type TempTypeAnimal = {
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
  AnimalArticleID?: number;
  //AnimalArticle?: AnimalArticle;
  PortraitID?: string;
  Portrait?: CmsImage;
  TenantID: string;
  //Tenant?: Tenant;
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
  LargestAvailableSize: 'thumbnail' | 'small' | 'medium' | 'large' | 'xlarge';
  MediaTags: CmsTag[]
  TenantID: string,
  Tenant: any //TODO
}

export type CmsTag = {
  ID: number,
  Name: string,
  Color: string,
}
