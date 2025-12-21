import { CmsArticle } from 'sheltify-lib/article-types';
import { CmsAnimal, CmsBlogEntry, CmsPage, CmsTeamMember } from 'sheltify-lib/cms-types';

export function createNewAnimal(name: string): CmsAnimal {
  return {
    ID: '',
    Birthday: "2018-03-29T15:04:05Z", //TODO
    Castrated: {Bool: false, Valid: false},
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
  };
}

export function createEmptyArticle(): CmsArticle {
  return {ID: '', Structure: {Rows: []}, TenantID: ''}
}

export function createNewPage(): CmsPage {
  return {
    ID: '',
    Description: "",
    Title: '',
    Path: '',
    ShowInMenu: true,
    LinkInFooter: false,
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
