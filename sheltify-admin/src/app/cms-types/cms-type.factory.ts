import { CmsArticle } from 'sheltify-lib/article-types';
import { CmsAnimal, CmsBlogEntry, CmsHomeFoundEntry, CmsPage, CmsTeamMember, SqlNullBoolNull } from 'sheltify-lib/cms-types';

export function createNewAnimal(name: string): CmsAnimal {
  return {
    ID: '',
    Birthday: "2018-03-29T15:04:05Z", //TODO
    Castrated: SqlNullBoolNull,
    Gender: '',
    Where: '',
    Health: '',
    Patrons: '',
    Priority: 0,
    ShoulderHeightCm: 0,
    Status: 'tierheim',
    TenantID: '',
    WeightKg: 0,
    Name: name,
    Description: "",
    MediaFiles: [],
    NoAdoption: false,
    FreeRoamer: SqlNullBoolNull,
    HomeFoundStatus: 'no',
  };
}

export function createHomeFoundEntry(animalID: string): CmsHomeFoundEntry {
  return {
    ID: '',
    AnimalName: '',
    Content: {
      Html: '',
      MediaFiles: [],
    },
    TenantID: '',
  }
}

export function createEmptyArticle(): CmsArticle {
  return {ID: '', Structure: {Rows: []}, TenantID: ''}
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
