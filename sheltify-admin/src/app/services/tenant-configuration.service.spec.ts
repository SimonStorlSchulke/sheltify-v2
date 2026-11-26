import { TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { CmsTenantConfiguration } from 'sheltify-lib/cms-types';
import { CmsRequestService } from './cms-request.service';
import { TenantConfigurationService } from './tenant-configuration.service';

describe('TenantConfigurationService', () => {
  let postPatchOrDeleteCalled$: Subject<void>;

  function create(config: Partial<CmsTenantConfiguration>) {
    postPatchOrDeleteCalled$ = new Subject<void>();
    TestBed.configureTestingModule({
      providers: [{
        provide: CmsRequestService,
        useValue: {
          getTenantConfiguration: () => of({ NeedsRebuild: false, ...config }),
          postPatchOrDeleteCalled$,
        },
      }],
    });
    return TestBed.inject(TenantConfigurationService);
  }

  it('appends a trailing slash to the site url', async () => {
    expect(await create({ SiteUrl: 'https://example.org' }).siteUrl()).toBe('https://example.org/');
  });

  it('keeps an existing trailing slash', async () => {
    expect(await create({ SiteUrl: 'https://example.org/' }).siteUrl()).toBe('https://example.org/');
  });

  it('returns undefined without a site url', async () => {
    expect(await create({ SiteUrl: '' }).siteUrl()).toBeUndefined();
  });

  it('splits comma separated values', async () => {
    const service = create({ AnimalKinds: 'Hund,Katze', AnimalStati: '' });
    expect(await service.animalKinds()).toEqual(['Hund', 'Katze']);
    expect(await service.animalStati()).toEqual([]);
  });

  it('uses the only animal kind as default', async () => {
    expect(await create({ AnimalKinds: 'Hund' }).useDefaultAnimalKind()).toBe('Hund');
  });

  it('has no default animal kind when there are several', async () => {
    expect(await create({ AnimalKinds: 'Hund,Katze' }).useDefaultAnimalKind()).toBeUndefined();
  });

  it('needs a rebuild after data was modified', () => {
    const service = create({});
    expect(service.needsRebuild()).toBe(false);
    postPatchOrDeleteCalled$.next();
    expect(service.needsRebuild()).toBe(true);
  });
});
