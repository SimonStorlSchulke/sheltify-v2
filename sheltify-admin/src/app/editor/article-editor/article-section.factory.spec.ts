import { SectionSpecial, SectionType } from 'sheltify-lib/article-types';
import { createEmptySection, newSpecialSection } from './article-section.factory';

describe('createEmptySection', () => {
  const types: SectionType[] = [
    'columns', 'form', 'title', 'text', 'video', 'image', 'hero', 'html', 'animal-list', 'home-found',
    'home-found-feedback', 'separator-x', 'file', 'animal-updates', 'blogs', 'special', 'team-member',
  ];

  it.each(types)('creates a %s section', type => {
    const section = createEmptySection(type);
    expect(section.SectionType).toBe(type);
    expect(section.BackgroundColor).toBe('');
  });

  it('returns a new object on every call', () => {
    const a = createEmptySection('columns');
    const b = createEmptySection('columns');
    expect(a).not.toBe(b);
    expect(a).toEqual(b);
  });

  it('creates columns with two equally sized empty columns', () => {
    const section = createEmptySection('columns');
    if (section.SectionType !== 'columns') throw new Error('wrong type');
    expect(section.Content.Columns).toEqual([{ Sections: [], Grow: 1 }, { Sections: [], Grow: 1 }]);
  });
});

describe('newSpecialSection', () => {
  it('creates properties with type specific default values', () => {
    const section: SectionSpecial = newSpecialSection('donation', {
      donation: [
        { Name: 'title', Type: 'string' },
        { Name: 'amount', Type: 'number' },
        { Name: 'active', Type: 'boolean' },
        { Name: 'picture', Type: 'image' },
      ],
    });

    expect(section.SectionType).toBe('special');
    expect(section.Content.Type).toBe('donation');
    expect(section.Content.Properties).toEqual([
      ['title', 'string'], ['amount', 'number'], ['active', 'boolean'], ['picture', 'image'],
    ]);
    expect(section.Content.PropertyValues).toEqual(['', 0, false, undefined]);
  });
});
