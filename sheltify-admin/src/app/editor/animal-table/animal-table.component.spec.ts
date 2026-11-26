import { signal, WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { CmsAnimal, SqlNullBoolFalse, SqlNullBoolTrue } from 'sheltify-lib/cms-types';
import { createNewAnimal } from '@app/cms-types/cms-type.factory';
import { AlertService } from '@app/services/alert.service';
import { AnimalService } from '@app/services/animal.service';
import { AskSaveService } from '@app/services/ask-save.service';
import { CmsRequestService } from '@app/services/cms-request.service';
import { ModalService } from '@app/services/modal.service';
import { TenantConfigurationService } from '@app/services/tenant-configuration.service';
import { AnimalTableComponent } from './animal-table.component';

describe('AnimalTableComponent', () => {
  let component: AnimalTableComponent;
  let animals: WritableSignal<CmsAnimal[]>;

  const animal = (name: string, partial: Partial<CmsAnimal> = {}): CmsAnimal =>
    ({ ...createNewAnimal(name), ID: name, ...partial });
  const names = () => component.animalList().map(a => a.Name);

  beforeEach(() => {
    localStorage.clear();
    animals = signal<CmsAnimal[]>([]);
    TestBed.configureTestingModule({
      imports: [AnimalTableComponent],
      providers: [
        { provide: AnimalService, useValue: { animals, reloadAnimals: vi.fn(), setStatus: vi.fn(), save: vi.fn() } },
        {
          provide: TenantConfigurationService, useValue: {
            config: signal(undefined),
            animalKinds: vi.fn().mockResolvedValue([]),
            animalStati: vi.fn().mockResolvedValue([]),
          },
        },
        { provide: AskSaveService, useValue: { triggerSave$: new Subject<string[]>(), markDirty: vi.fn() } },
        { provide: ModalService, useValue: {} },
        { provide: CmsRequestService, useValue: {} },
        { provide: AlertService, useValue: {} },
      ],
    });
    // no change detection: only the component logic is tested, not the template
    component = TestBed.createComponent(AnimalTableComponent).componentInstance;
  });

  describe('filtering', () => {
    beforeEach(() => animals.set([
      animal('Bello', { AnimalKind: 'Hund' }),
      animal('Minka', { AnimalKind: 'Katze' }),
      animal('Bella', { AnimalKind: 'Hund' }),
    ]));

    it('filters by name, case insensitive', () => {
      component.search.set('BEL');
      expect(names()).toEqual(['Bello', 'Bella']);
    });

    it('filters by animal kind', () => {
      component.selectedAnimalKind.set('Katze');
      expect(names()).toEqual(['Minka']);
    });
  });

  describe('sorting', () => {
    it('cycles through ascending, descending and unsorted', () => {
      component.toggleSort('name');
      expect(component.sort()).toEqual({ key: 'name', direction: 1 });
      expect(component.sortIndicator('name')).toBe('▲');
      component.toggleSort('name');
      expect(component.sort()).toEqual({ key: 'name', direction: -1 });
      expect(component.sortIndicator('name')).toBe('▼');
      component.toggleSort('name');
      expect(component.sort()).toBeNull();
      expect(component.sortIndicator('name')).toBe('');
    });

    it('starts ascending when switching columns', () => {
      component.toggleSort('name');
      component.toggleSort('name');
      component.toggleSort('priority');
      expect(component.sort()).toEqual({ key: 'priority', direction: 1 });
    });

    it('sorts names naturally and keeps the original order when unsorted', () => {
      animals.set([animal('Hund 10'), animal('hund 2'), animal('Äffchen')]);
      expect(names()).toEqual(['Hund 10', 'hund 2', 'Äffchen']);
      component.toggleSort('name');
      expect(names()).toEqual(['Äffchen', 'hund 2', 'Hund 10']);
      component.toggleSort('name');
      expect(names()).toEqual(['Hund 10', 'hund 2', 'Äffchen']);
    });

    it('sorts numbers numerically and puts empty values last in both directions', () => {
      animals.set([
        animal('a', { ShoulderHeightCm: 50 }),
        animal('b', { ShoulderHeightCm: 0 }),
        animal('c', { ShoulderHeightCm: 8 }),
      ]);
      component.toggleSort('shoulderHeight');
      expect(names()).toEqual(['c', 'a', 'b']);
      component.toggleSort('shoulderHeight');
      expect(names()).toEqual(['a', 'c', 'b']);
    });

    it('sorts nullable booleans with unknown values last', () => {
      animals.set([
        animal('unknown'),
        animal('yes', { Castrated: SqlNullBoolTrue() }),
        animal('no', { Castrated: SqlNullBoolFalse() }),
      ]);
      component.toggleSort('castrated');
      expect(names()).toEqual(['no', 'yes', 'unknown']);
    });

    it('sorts by home found status order', () => {
      animals.set([
        animal('yes', { HomeFoundStatus: 'yes' }),
        animal('no', { HomeFoundStatus: 'no' }),
        animal('reserved', { HomeFoundStatus: 'reserved' }),
      ]);
      component.toggleSort('homeFoundStatus');
      expect(names()).toEqual(['no', 'reserved', 'yes']);
    });

    it('only allows sorting columns with a sort value', () => {
      expect(component.isSortable('name')).toBe(true);
      expect(component.isSortable('priority')).toBe(true);
      expect(component.isSortable('portrait')).toBe(false);
      expect(component.isSortable('description')).toBe(false);
    });
  });

  describe('columns', () => {
    it('shows the default columns initially', () => {
      expect(component.isColumnVisible('portrait')).toBe(true);
      expect(component.isColumnVisible('priority')).toBe(false);
    });

    it('remembers toggled columns', () => {
      component.toggleColumn('priority', true);
      component.toggleColumn('portrait', false);

      const restored = TestBed.createComponent(AnimalTableComponent).componentInstance;
      expect(restored.isColumnVisible('priority')).toBe(true);
      expect(restored.isColumnVisible('portrait')).toBe(false);
    });

    it('resets to the default columns', () => {
      component.toggleColumn('priority', true);
      component.resetColumns();
      expect(component.isColumnVisible('priority')).toBe(false);
      expect(component.isColumnVisible('portrait')).toBe(true);
    });

    it('hides tenant specific columns unless the feature is enabled', () => {
      const keys = component.availableColumns().map(c => c.key);
      expect(keys).not.toContain('race');
      expect(keys).not.toContain('patrons');
      expect(keys).not.toContain('animalKind');
      expect(keys).not.toContain('status');
    });

    it('shows the animal kind column with more than one animal kind', () => {
      component.animalKinds.set(['alle', 'Hund', 'Katze']);
      expect(component.availableColumns().map(c => c.key)).toContain('animalKind');
    });
  });

  it('sets the home found date when an animal is marked as home found', () => {
    const a = animal('Bello');
    component.onHomeFoundStatusChange(a, 'yes');
    expect(a.HomeFoundAt.Valid).toBe(true);
  });
});
