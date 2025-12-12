import { CmsArticle } from 'src/app/cms-types/article-types';
import { CmsAnimal, CmsPage } from 'src/app/cms-types/cms-types';

export function createNewAnimal(name: string): CmsAnimal {
  return {
    ID: '',
    Birthday: "2018-03-29T15:04:05Z", //TODO
    Castrated: false,
    Gender: "male",
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
  }
}
