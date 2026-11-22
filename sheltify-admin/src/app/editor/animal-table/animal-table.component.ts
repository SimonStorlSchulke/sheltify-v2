import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, computed, inject, model, OnInit, signal, TemplateRef, viewChild, ViewContainerRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { createNewAnimal } from '@app/cms-types/cms-type.factory';
import { CheckboxInputComponent } from '@app/forms/checkbox-input/checkbox-input.component';
import { DatePickerComponent } from '@app/forms/date-picker/date-picker.component';
import { ImagePickerSingleComponent } from '@app/forms/image-picker-single/image-picker-single.component';
import { NumberInputComponent } from '@app/forms/number-input/number-input.component';
import { RadioButtonsInputComponent } from '@app/forms/radio-buttons-input/radio-buttons-input.component';
import { SelectInputComponent } from '@app/forms/select-input/select-input.component';
import { TextInputComponent } from '@app/forms/text-input/text-input.component';
import { TextInputModalComponent } from '@app/forms/text-input-modal/text-input-modal.component';
import { AlertService } from '@app/services/alert.service';
import { AnimalService } from '@app/services/animal.service';
import { AskSaveService } from '@app/services/ask-save.service';
import { CmsRequestService } from '@app/services/cms-request.service';
import { ModalService } from '@app/services/modal.service';
import { TenantConfigurationService } from '@app/services/tenant-configuration.service';
import { BtIconComponent } from '@app/ui/bt-icon/bt-icon.component';
import { firstValueFrom } from 'rxjs';
import { CmsAnimal, SqlNullTimeNow } from 'sheltify-lib/dist/cms-types';

type ColumnKey =
  | 'portrait' | 'animalKind' | 'race' | 'subTitle' | 'gender' | 'birthday' | 'weight' | 'shoulderHeight'
  | 'castrated' | 'freeRoamer' | 'description' | 'health' | 'homeFoundStatus' | 'homeFoundAt' | 'homeFoundText'
  | 'status' | 'where' | 'noAdoption' | 'patronsNeeded' | 'patrons' | 'priority' | 'internalNote';

type SortKey = ColumnKey | 'name';
type SortValue = string | number | null;

interface AnimalColumn {
  key: ColumnKey;
  label: string;
  defaultVisible: boolean;
  /** Value to sort by. Columns without it are not sortable. */
  sortValue?: (animal: CmsAnimal) => SortValue;
}

/** Text fields that are edited in a modal because they are usually long. */
type LongTextField = 'Description' | 'Health' | 'InternalNote';

const visibleColumnsStorageKey = 'animal-table-visible-columns';

const homeFoundOrder: Record<CmsAnimal['HomeFoundStatus'], number> = { no: 0, reserved: 1, yes: 2 };

const nullTimeValue = (time: { Valid: boolean, Time?: string | Date | null }) =>
  time?.Valid && time.Time ? new Date(time.Time).getTime() : null;
const nullBoolValue = (value: { Valid: boolean, Bool: boolean }) =>
  value?.Valid ? Number(value.Bool) : null;

@Component({
  selector: 'app-animal-table',
  imports: [
    CheckboxInputComponent,
    RadioButtonsInputComponent,
    ImagePickerSingleComponent,
    RouterLink,
    BtIconComponent,
    NumberInputComponent,
    TextInputComponent,
    SelectInputComponent,
    DatePickerComponent,
  ],
  templateUrl: './animal-table.component.html',
  styleUrl: './animal-table.component.scss',
})
export class AnimalTableComponent implements OnInit {
  private animalService = inject(AnimalService);
  protected tenantConfigurationService = inject(TenantConfigurationService);
  protected askSaveService = inject(AskSaveService);
  protected modalService = inject(ModalService);
  protected cmsRequestService = inject(CmsRequestService);
  private alertService = inject(AlertService);

  search = signal('');

  animalKinds = signal<string[]>(['alle']);
  selectedAnimalKind = model<string>('alle');

  animalStati = signal<string[]>([]);

  /** All columns except the name, which is always shown and not editable. */
  private readonly allColumns: AnimalColumn[] = [
    { key: 'portrait', label: 'Bild', defaultVisible: true },
    { key: 'animalKind', label: 'Art', defaultVisible: false, sortValue: a => a.AnimalKind ?? null },
    { key: 'race', label: 'Rasse', defaultVisible: false, sortValue: a => a.Race },
    { key: 'subTitle', label: 'Untertitel', defaultVisible: false, sortValue: a => a.SubTitle },
    { key: 'gender', label: 'Geschlecht', defaultVisible: true, sortValue: a => a.Gender },
    { key: 'birthday', label: 'Geboren ca.', defaultVisible: false, sortValue: a => nullTimeValue(a.Birthday) },
    { key: 'weight', label: 'Gewicht (kg)', defaultVisible: false, sortValue: a => a.WeightKg || null },
    { key: 'shoulderHeight', label: 'Schulterhöhe (cm)', defaultVisible: true, sortValue: a => a.ShoulderHeightCm || null },
    { key: 'castrated', label: 'Kastriert', defaultVisible: true, sortValue: a => nullBoolValue(a.Castrated) },
    { key: 'freeRoamer', label: 'Freigänger', defaultVisible: false, sortValue: a => nullBoolValue(a.FreeRoamer) },
    { key: 'description', label: 'Beschreibung', defaultVisible: true },
    { key: 'health', label: 'Gesundheit', defaultVisible: false },
    { key: 'homeFoundStatus', label: 'Vermittlungsstatus', defaultVisible: true, sortValue: a => homeFoundOrder[a.HomeFoundStatus] ?? null },
    { key: 'homeFoundAt', label: 'Vermittelt am', defaultVisible: false, sortValue: a => nullTimeValue(a.HomeFoundAt) },
    { key: 'homeFoundText', label: 'Vermittelt - Text', defaultVisible: false, sortValue: a => a.HomeFoundText },
    { key: 'status', label: 'Status', defaultVisible: true, sortValue: a => a.Status },
    { key: 'where', label: 'Wo in Deutschland?', defaultVisible: false, sortValue: a => a.Where },
    { key: 'noAdoption', label: 'Keine Adoption', defaultVisible: false, sortValue: a => Number(a.NoAdoption) },
    { key: 'patronsNeeded', label: 'Paten gesucht', defaultVisible: false, sortValue: a => Number(a.PatronsNeeded) },
    { key: 'patrons', label: 'Paten', defaultVisible: false, sortValue: a => a.Patrons },
    { key: 'priority', label: 'Priorität', defaultVisible: false, sortValue: a => a.Priority },
    { key: 'internalNote', label: 'Kommentar (intern)', defaultVisible: false },
  ];

  /** Columns that make sense for this tenant. */
  availableColumns = computed(() => {
    const config = this.tenantConfigurationService.config();
    const hasAnimalKinds = this.animalKinds().filter(kind => kind !== 'alle').length > 1;
    return this.allColumns.filter(column => {
      switch (column.key) {
        case 'animalKind': return hasAnimalKinds;
        case 'race': return !!config?.AnimalFeatureRace;
        case 'noAdoption': return !!config?.AnimalFeatureNoAdoption;
        case 'patronsNeeded':
        case 'patrons': return !!config?.AnimalFeaturePatrons;
        case 'status': return this.animalStati().length > 0;
        default: return true;
      }
    });
  });

  visibleColumnKeys = signal<Set<ColumnKey>>(this.loadVisibleColumns());
  visibleColumns = computed(() => this.availableColumns().filter(column => this.visibleColumnKeys().has(column.key)));

  sort = signal<{ key: SortKey, direction: 1 | -1 } | null>(null);

  animalList = computed(() => {
    const filtered = this.animalService.animals().filter(animal => {
      const matchesSearch = animal.Name?.toLowerCase().includes(this.search().toLowerCase());
      const matchesAnimalKind = this.selectedAnimalKind() == 'alle' || this.selectedAnimalKind() == animal.AnimalKind;
      return matchesSearch && matchesAnimalKind;
    });

    // Note: edits mutate the animals in place and don't re-trigger this computed,
    // so rows don't jump around while their sorted value is being edited.
    const sort = this.sort();
    const getValue = sort && this.sortValueGetter(sort.key);
    if (!sort || !getValue) return filtered;
    return [...filtered].sort((a, b) => compareSortValues(getValue(a), getValue(b), sort.direction));
  })

  constructor() {
    this.tenantConfigurationService.animalKinds().then(animalKinds => this.animalKinds.set(['alle', ...animalKinds]));
    this.animalService.reloadAnimals();
    this.askSaveService.triggerSave$.pipe(takeUntilDestroyed()).subscribe((ids) => this.saveOnReroute(ids));
  }

  async ngOnInit() {
    this.animalStati.set(await this.tenantConfigurationService.animalStati())
    this.animalKinds.set(await this.tenantConfigurationService.animalKinds());
  }

  // --- columns -------------------------------------------------------------

  private readonly dialog = inject(Dialog);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly columnPicker = viewChild.required<TemplateRef<unknown>>('columnPicker');
  private columnPickerRef?: DialogRef<unknown, unknown>;

  openColumnPicker() {
    this.columnPickerRef = this.dialog.open(this.columnPicker(), {
      panelClass: 'modal-lg',
      viewContainerRef: this.viewContainerRef,
      autoFocus: 'dialog',
      ariaLabel: 'Spalten auswählen',
    });
  }

  closeColumnPicker() {
    this.columnPickerRef?.close();
  }

  isColumnVisible(key: ColumnKey): boolean {
    return this.visibleColumnKeys().has(key);
  }

  toggleColumn(key: ColumnKey, visible: boolean) {
    const keys = new Set(this.visibleColumnKeys());
    visible ? keys.add(key) : keys.delete(key);
    this.setVisibleColumns(keys);
  }

  resetColumns() {
    this.setVisibleColumns(new Set(this.allColumns.filter(c => c.defaultVisible).map(c => c.key)));
  }

  private setVisibleColumns(keys: Set<ColumnKey>) {
    this.visibleColumnKeys.set(keys);
    try {
      localStorage.setItem(visibleColumnsStorageKey, JSON.stringify([...keys]));
    } catch {
      // storage not available - the choice just isn't remembered
    }
  }

  private loadVisibleColumns(): Set<ColumnKey> {
    try {
      const stored = localStorage.getItem(visibleColumnsStorageKey);
      if (stored) return new Set(JSON.parse(stored) as ColumnKey[]);
    } catch {
      // ignore invalid or unavailable storage
    }
    return new Set(this.allColumns.filter(c => c.defaultVisible).map(c => c.key));
  }

  // --- sorting -------------------------------------------------------------

  isSortable(key: SortKey): boolean {
    return !!this.sortValueGetter(key);
  }

  /** Cycles through ascending, descending and unsorted. */
  toggleSort(key: SortKey) {
    const current = this.sort();
    if (current?.key !== key) {
      this.sort.set({ key, direction: 1 });
    } else if (current.direction === 1) {
      this.sort.set({ key, direction: -1 });
    } else {
      this.sort.set(null);
    }
  }

  sortIndicator(key: SortKey): string {
    const sort = this.sort();
    if (sort?.key !== key) return '';
    return sort.direction === 1 ? '▲' : '▼';
  }

  private sortValueGetter(key: SortKey): ((animal: CmsAnimal) => SortValue) | undefined {
    if (key === 'name') return animal => animal.Name;
    return this.allColumns.find(column => column.key === key)?.sortValue;
  }

  // --- editing -------------------------------------------------------------

  setStatus(animal: CmsAnimal, status: string, active: boolean) {
    this.setDirty(animal);
    this.animalService.setStatus(animal, status, active, this.animalStati())
  }

  onHomeFoundStatusChange(animal: CmsAnimal, status: string | undefined) {
    if (status === 'yes' && !animal.HomeFoundAt?.Valid) {
      animal.HomeFoundAt = SqlNullTimeNow();
    }
  }

  async editLongText(animal: CmsAnimal, field: LongTextField, label: string) {
    const text = await this.modalService.openFinishable(TextInputModalComponent, {
      label,
      presetText: animal[field] ?? '',
      long: true,
    }, 'modal-lg', true);
    if (text === undefined || text === animal[field]) return;
    animal[field] = text;
    this.setDirty(animal);
  }

  setDirty(animal: CmsAnimal) {
    this.askSaveService.markDirty(animal.ID);
  }

  async saveEditedAnimals() {
    const unsavedAnimals = this.animalList().filter(animal => this.askSaveService.getDirtyIds().has(animal.ID));
    await this.saveAnimals(unsavedAnimals);
  }

  private async saveOnReroute(ids: string[]) {
    const unsavedAnimals = this.animalList().filter(animal => ids.includes(animal.ID));
    await this.saveAnimals(unsavedAnimals);
  }

  private async saveAnimals(unsavedAnimals: CmsAnimal[]) {
    for (const unsavedAnimal of unsavedAnimals) {
      try {
        await this.animalService.save(unsavedAnimal, false);
        this.askSaveService.cleanId(unsavedAnimal.ID);
      } catch (error) {
        console.error(error);
      }
    }
  }


  async deleteAnimal(animal: CmsAnimal) {
    if (!await this.alertService.confirmDelete()) return;

    await firstValueFrom(this.cmsRequestService.deleteAnimals([animal.ID]));
    this.askSaveService.cleanId(animal.ID);
    await this.animalService.reloadAnimals();
  }

  async newAnimal() {

    const name = await this.modalService.openFinishable(TextInputModalComponent, {
      label: "Name eingeben"
    });
    if(!name) return;

    const useDefaultAnimalKind = await this.tenantConfigurationService.useDefaultAnimalKind();

    const animal = createNewAnimal(name, useDefaultAnimalKind);

    await firstValueFrom(this.cmsRequestService.saveAnimal(animal));
    await this.animalService.reloadAnimals();
  }
}

function compareSortValues(a: SortValue, b: SortValue, direction: 1 | -1): number {
  const aEmpty = a === null || a === undefined || a === '';
  const bEmpty = b === null || b === undefined || b === '';
  if (aEmpty || bEmpty) return aEmpty === bEmpty ? 0 : aEmpty ? 1 : -1;
  const result = typeof a === 'number' && typeof b === 'number'
    ? a - b
    : String(a).localeCompare(String(b), 'de', { numeric: true, sensitivity: 'base' });
  return result * direction;
}
