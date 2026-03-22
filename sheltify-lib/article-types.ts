import { CmsAnimal, CmsImage, CmsType, SqlNullTime } from './cms-types';

export const SectionTypes = ['title', 'text', 'video', 'image', 'hero', 'animal-list', 'html', 'separator-x', 'home-found', 'columns', 'form', 'file', 'animal-updates', 'special'] as const;

export type SectionType = (typeof SectionTypes)[number];

export type CmsArticle = CmsType & {
  CreatedAt?: string;
  UpdatedAt?: string;
  DeletedAt?: string | null;
  TenantID: string;
  ContentUpdateNote: string,
  ContentUpdateAt: SqlNullTime,
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
  | SectionForm
  | SectionFile
  | SectionAnimalUpdates
  | SectionSpecial

export type SectionColumns = {
  SectionType: 'columns',
  BackgroundColor: string,
  Content: {
    FullWidth: boolean,
    Columns: {
      Sections: Section[],
      Grow: number,
    }[]
  },
};

export const FormInputTypes = ['text', 'email', 'textarea', 'checkbox', 'calendar', 'radio'];
export type SectionForm = {
  SectionType: 'form',
  BackgroundColor: string,
  Content: {
    Name: string,
    Inputs: {
      Type: (typeof FormInputTypes)[number],
      RadioOptions?: string[],
      Label: string,
      Required: boolean,
    }[],
    SubmitButtonText: string,
    SubmitInfo: string,
    AfterSubmitText: string,
    ForwardToEmails: string[],
  },
};

export type SectionText = {
  SectionType: 'text',
  BackgroundColor: string,
  Content: {
    Html: string;
  },
};

export type SectionFile = {
  SectionType: 'file',
  BackgroundColor: string,
  Content: {
    File: CmsImage | undefined;
    Text: string,
  },
};

export type SectionHtml = {
  SectionType: 'html',
  BackgroundColor: string,
  Content: {
    Html: string;
  },
};

export type SectionImages = {
  SectionType: 'image',
  BackgroundColor: string,
  Content: {
    Size: 'small' | 'medium' | 'large',
    Layout: 'vertical' | 'horizontal' | 'gallery',
    MediaFiles: CmsImage[];
  },
};

export type SectionHero = {
  SectionType: 'hero',
  BackgroundColor: string,
  Content: {
    Text: string;
    MediaFiles: CmsImage[];
    DurationSeconds?: number;
  },
};

export type SectionTitle = {
  SectionType: 'title',
  BackgroundColor: string,
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
  BackgroundColor: string,
  Content: AnimalsFilter,
  TempFoundAnimals: CmsAnimal[],
};

export type SectionAnimalUpdates = {
  SectionType: 'animal-updates',
  BackgroundColor: string,
  Content: {
    days: number,
    layout: 'compact' | 'large',
  },
  TempAnimalsByArticle: Record<string, CmsAnimal[]>,
};

/** For sections that are very specific to an organisations website */
export type SectionSpecial = {
  SectionType: 'special',
  BackgroundColor: string,
  Content: {
    Type: string,
    Properties: [string, string][],
    PropertyValues: any[], //yeah, yeah I know...
  },
  TempData: any,
}

export type SectionHomeFound = {
  SectionType: 'home-found',
  BackgroundColor: string,
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
  BackgroundColor: string,
  Content: {
    Title: string,
    Url: string,
  },
};

export type SectionSeparatorX = {
  SectionType: 'separator-x',
  BackgroundColor: string,
};
