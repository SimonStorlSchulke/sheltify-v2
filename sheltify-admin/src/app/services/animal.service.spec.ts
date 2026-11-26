import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CmsAnimal, SqlNullTimeNow } from 'sheltify-lib/cms-types';
import { createNewAnimal } from '@app/cms-types/cms-type.factory';
import { AnimalService } from './animal.service';
import { CmsRequestService } from './cms-request.service';

describe('AnimalService', () => {
  let service: AnimalService;
  let cmsRequestService: { getAnimals: ReturnType<typeof vi.fn>, saveAnimal: ReturnType<typeof vi.fn> };

  const animal = (partial: Partial<CmsAnimal> = {}): CmsAnimal => ({ ...createNewAnimal('Bello'), ...partial });

  beforeEach(() => {
    cmsRequestService = {
      getAnimals: vi.fn().mockReturnValue(of({ results: [] })),
      saveAnimal: vi.fn((a: CmsAnimal) => of(a)),
    };
    TestBed.configureTestingModule({
      providers: [{ provide: CmsRequestService, useValue: cmsRequestService }],
    });
    service = TestBed.inject(AnimalService);
  });

  it('loads the animals', async () => {
    const animals = [animal({ ID: '1' })];
    cmsRequestService.getAnimals.mockReturnValue(of({ results: animals }));
    await service.reloadAnimals();
    expect(service.animals()).toEqual(animals);
  });

  it('groups animals by article', () => {
    const a = animal({ ID: '1', ArticleID: 'x' });
    const b = animal({ ID: '2', ArticleID: 'x' });
    const c = animal({ ID: '3' });
    service.animals.set([a, b, c]);
    expect(service.animalsByArticleID()).toEqual({ x: [a, b], NoArticle: [c] });
  });

  describe('setStatus', () => {
    it('adds and removes a status', () => {
      const a = animal({ Status: 'tierheim' });
      service.setStatus(a, 'notfall', true, ['tierheim', 'notfall']);
      expect(a.Status).toBe('tierheim,notfall');
      service.setStatus(a, 'tierheim', false, ['tierheim', 'notfall']);
      expect(a.Status).toBe('notfall');
    });

    it('does not add a status twice', () => {
      const a = animal({ Status: 'notfall' });
      service.setStatus(a, 'notfall', true, ['notfall']);
      expect(a.Status).toBe('notfall');
    });

    it('drops stati that are no longer configured', () => {
      const a = animal({ Status: 'old,notfall' });
      service.setStatus(a, 'pflegestelle', true, ['notfall', 'pflegestelle']);
      expect(a.Status).toBe('notfall,pflegestelle');
    });

    it('handles an empty status', () => {
      const a = animal({ Status: '' });
      service.setStatus(a, 'notfall', true, ['notfall']);
      expect(a.Status).toBe('notfall');
    });
  });

  it('is only published with a publish date and an article', () => {
    expect(service.isPublished(animal({ PublishedAt: SqlNullTimeNow(), ArticleID: 'x' }))).toBe(true);
    expect(service.isPublished(animal({ PublishedAt: SqlNullTimeNow() }))).toBe(false);
    expect(service.isPublished(animal({ ArticleID: 'x' }))).toBe(false);
  });

  describe('togglePublished', () => {
    it('publishes an unpublished animal', async () => {
      const a = animal();
      await service.togglePublished(a);
      expect(a.PublishedAt?.Valid).toBe(true);
      expect(cmsRequestService.saveAnimal).toHaveBeenCalledWith(a, true);
    });

    it('unpublishes a published animal', async () => {
      const a = animal({ PublishedAt: SqlNullTimeNow() });
      await service.togglePublished(a);
      expect(a.PublishedAt?.Valid).toBe(false);
    });

    it('reverts publishing when saving fails', async () => {
      cmsRequestService.saveAnimal.mockReturnValue(throwError(() => new Error('nope')));
      const a = animal();
      await service.togglePublished(a);
      expect(a.PublishedAt?.Valid).toBe(false);
    });
  });
});
