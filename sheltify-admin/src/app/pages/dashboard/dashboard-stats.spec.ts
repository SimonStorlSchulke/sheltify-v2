import { CmsAnimal, CmsFormSubmission } from 'sheltify-lib/cms-types';
import {
  computeAnimalStats,
  computeAttentionItems,
  countByKind,
  countByStatus,
  homeFoundPerYear,
  isFormUnread,
  recentHomeFound,
} from './dashboard-stats';

const NOW = new Date('2026-06-15T12:00:00Z');

function animal(overrides: Partial<CmsAnimal> = {}): CmsAnimal {
  return {
    ID: Math.random().toString(36).slice(2),
    InternalNote: '',
    Name: 'Tier',
    SubTitle: '',
    AnimalKind: 'Hund',
    Race: '',
    Birthday: {Time: null, Valid: false},
    WeightKg: 0,
    ShoulderHeightCm: 0,
    Castrated: {Bool: false, Valid: false},
    Gender: '',
    Description: 'lieb',
    Where: '',
    Patrons: '',
    Status: '',
    Health: '',
    Priority: 0,
    ArticleID: 'article',
    PortraitID: 'portrait',
    MediaFiles: [],
    NoAdoption: false,
    PatronsNeeded: false,
    FreeRoamer: {Bool: false, Valid: false},
    HomeFoundStatus: 'no',
    HomeFoundAt: {Time: null, Valid: false},
    HomeFoundText: '',
    PublishedAt: {Time: '2026-01-01T00:00:00Z', Valid: true},
    UpdatedAt: new Date('2026-06-01T00:00:00Z'),
    ...overrides,
  };
}

const homeFound = (time: string) => animal({HomeFoundStatus: 'yes', HomeFoundAt: {Time: time, Valid: true}});

describe('computeAnimalStats', () => {
  it('counts animals by state', () => {
    const stats = computeAnimalStats([
      animal(),
      animal({PublishedAt: {Time: null, Valid: false}}),
      animal({ArticleID: 'NoArticle'}),
      animal({HomeFoundStatus: 'reserved', PatronsNeeded: true}),
      homeFound('2026-03-01T00:00:00Z'),
      homeFound('2025-03-01T00:00:00Z'),
      homeFound('2024-03-01T00:00:00Z'),
    ], NOW);

    expect(stats).toEqual({
      total: 7,
      available: 3,
      published: 5,
      drafts: 2,
      reserved: 1,
      homeFoundThisYear: 1,
      homeFoundLastYear: 1,
      patronsNeeded: 1,
    });
  });

  it('handles an empty list', () => {
    expect(computeAnimalStats([], NOW).total).toBe(0);
  });
});

describe('recentHomeFound', () => {
  it('returns home found animals newest first, limited', () => {
    const a = homeFound('2026-01-01T00:00:00Z');
    const b = homeFound('2026-05-01T00:00:00Z');
    const c = homeFound('2025-05-01T00:00:00Z');
    expect(recentHomeFound([a, animal(), c, b], 2)).toEqual([b, a]);
  });

  it('ignores animals without a valid date', () => {
    expect(recentHomeFound([animal({HomeFoundStatus: 'yes'})], 5)).toEqual([]);
  });
});

describe('homeFoundPerYear', () => {
  it('returns one entry per year, current year last', () => {
    const result = homeFoundPerYear([
      homeFound('2026-01-01T12:00:00Z'),
      homeFound('2026-02-01T12:00:00Z'),
      homeFound('2024-02-01T12:00:00Z'),
      homeFound('2010-02-01T12:00:00Z'),
    ], 3, NOW);
    expect(result).toEqual([
      {label: '2024', count: 1},
      {label: '2025', count: 0},
      {label: '2026', count: 2},
    ]);
  });
});

describe('countByKind / countByStatus', () => {
  it('groups animals in care by kind, sorted by count', () => {
    const result = countByKind([
      animal({AnimalKind: 'Katze'}),
      animal({AnimalKind: 'Hund'}),
      animal({AnimalKind: 'Katze'}),
      animal({AnimalKind: ''}),
      homeFound('2026-01-01T00:00:00Z'),
    ]);
    expect(result).toEqual([
      {label: 'Katze', count: 2},
      {label: 'Hund', count: 1},
      {label: 'ohne Tierart', count: 1},
    ]);
  });

  it('counts multiple stati per animal and ignores unknown ones', () => {
    const result = countByStatus([
      animal({Status: 'Notfall,Senior'}),
      animal({Status: 'Senior, alt'}),
      animal({Status: ''}),
    ], ['Notfall', 'Senior']);
    expect(result).toEqual([
      {label: 'Senior', count: 2},
      {label: 'Notfall', count: 1},
    ]);
  });
});

describe('computeAttentionItems', () => {
  const keysOf = (animals: CmsAnimal[]) => computeAttentionItems(animals, NOW).map(i => i.key);

  it('returns nothing for complete animals', () => {
    expect(keysOf([animal()])).toEqual([]);
  });

  it('flags missing portrait and description only for published animals', () => {
    const published = animal({PortraitID: undefined, Description: ' '});
    const draft = animal({PortraitID: undefined, Description: '', PublishedAt: {Time: null, Valid: false}});
    const items = computeAttentionItems([published, draft], NOW);
    expect(items.find(i => i.key === 'no-portrait')!.animals).toEqual([published]);
    expect(items.find(i => i.key === 'no-description')!.animals).toEqual([published]);
    expect(items.find(i => i.key === 'unpublished')!.animals).toEqual([draft]);
  });

  it('flags long reservations and stale profiles', () => {
    expect(keysOf([animal({HomeFoundStatus: 'reserved', UpdatedAt: new Date('2026-03-01T00:00:00Z')})]))
      .toEqual(['long-reserved']);
    expect(keysOf([animal({UpdatedAt: new Date('2025-06-01T00:00:00Z')})])).toEqual(['stale']);
  });

  it('ignores home found animals', () => {
    expect(keysOf([animal({HomeFoundStatus: 'yes', PortraitID: undefined, PublishedAt: {Time: null, Valid: false}})]))
      .toEqual([]);
  });
});

describe('isFormUnread', () => {
  it('treats forms without LastModifiedBy as unread', () => {
    const form = {ID: '1', InternalNote: '', Type: '', SenderMail: '', Text: ''} as CmsFormSubmission;
    expect(isFormUnread(form)).toBe(true);
    expect(isFormUnread({...form, LastModifiedBy: 'admin'})).toBe(false);
  });
});
