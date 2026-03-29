import { CmsArticle } from 'sheltify-lib/article-types';
import { CmsAnimal, CmsBlogEntry, CmsHomeFoundEntry, CmsPage, CmsTeamMember, SqlNullBoolNull, SqlNullTimeNull } from 'sheltify-lib/cms-types';

export function createNewAnimal(name: string, animalKind?: string): CmsAnimal {
  return {
    ID: '',
    Birthday: SqlNullTimeNull(),
    Castrated: SqlNullBoolNull(),
    Gender: '',
    Where: '',
    Health: '',
    Patrons: '',
    Priority: 0,
    AnimalKind: animalKind,
    ShoulderHeightCm: 0,
    Status: 'tierheim',
    TenantID: '',
    WeightKg: 0,
    Name: name,
    Description: "",
    MediaFiles: [],
    NoAdoption: false,
    PatronsNeeded: false,
    FreeRoamer: SqlNullBoolNull(),
    HomeFoundStatus: 'no',
    Race: '',
  };
}

export function createEmptyArticle(): CmsArticle {
  return {
    ID: '',
    Structure: {Rows: []},
    TenantID: '', ContentUpdateAt: SqlNullTimeNull(),
    ContentUpdateNote: '',
  }
}

export function createNewPage(): CmsPage {
  return {
    ID: '',
    Description: "",
    Path: '',
    ShowInMenu: true,
    LinkInFooter: false,
    Priority: 0,
  }
}

export function createNewHomeFoundEntry(): CmsHomeFoundEntry {
  return {
    ID: '',
    AnimalName: '',
    Content: {
      Html: '',
      MediaFiles: [],
    }
  }
}

export function createNewBlog(): CmsBlogEntry {
  return {
    ID: '',
    Description: "",
    Title: '',
    ShowPopup: false,
    Category: '',
    Priority: 0,
  }
}

export function createNewTeamMember(): CmsTeamMember {
  return {
    ID: '',
    Description: "",
    Name: '',
    EMail: '',
    Phone: '',
    Role: '',
    Priority: 0,
  }
}
