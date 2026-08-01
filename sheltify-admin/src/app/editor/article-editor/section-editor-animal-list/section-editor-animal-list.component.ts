import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, input, OnDestroy, OnInit, output, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RadioButtonsInputComponent } from '@app/forms/radio-buttons-input/radio-buttons-input.component';
import { AlertService } from '@app/services/alert.service';
import { TenantConfigurationService } from '@app/services/tenant-configuration.service';
import { CmsImageDirective } from '@app/ui/cms-image.directive';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';
import { debounceTime, firstValueFrom, Subject, Subscription } from 'rxjs';
import { SectionAnimalList } from 'sheltify-lib/article-types';
import { NumberInputComponent } from '@app/forms/number-input/number-input.component';
import { RangeInputComponent } from '@app/forms/range-input/range-input.component';
import { SelectInputComponent } from '@app/forms/select-input/select-input.component';
import { CmsRequestService } from '@app/services/cms-request.service';
import { CmsAnimal } from 'sheltify-lib/dist/cms-types';

@Component({
  selector: 'app-section-editor-animal-list',
  imports: [
    RangeInputComponent,
    FormsModule,
    SelectInputComponent,
    NumberInputComponent,
    RadioButtonsInputComponent,
    CmsImageDirective,
    DragDropModule
  ],
  templateUrl: './section-editor-animal-list.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './section-editor-animal-list.component.scss',
})
export class SectionEditorAnimalListComponent implements OnInit, OnDestroy {
  private cmsRequestService = inject(CmsRequestService);
  tenantConfigurationService = inject(TenantConfigurationService);
  alertService = inject(AlertService);
  animalStati: string[] = [];

  section = input.required<SectionAnimalList>();
  triggerRerender = output<void>();

  onInput = new Subject<void>();

  updateSubscription?: Subscription;

  async ngOnInit() {
    this.updateSubscription = this.onInput.pipe(debounceTime(600)).subscribe(() => this.updateAnimals());
    this.updateAnimals();
    this.animalStati = (await this.tenantConfigurationService.animalStati());
  }

  async updateAnimals() {
    this.section().TempFoundAnimals =
      await firstValueFrom(
        this.cmsRequestService.getFilteredAnimals(this.section().Content)
      );

    this.rebuildLists();

    this.triggerRerender.emit();
  }
  ngOnDestroy() {
    this.updateSubscription?.unsubscribe();
  }

  protected frontAnimals: CmsAnimal[] = [];

  protected middleAnimals: CmsAnimal[] = [];

  protected backAnimals: CmsAnimal[] = [];

  private rebuildLists() {
    const allAnimals = this.section().TempFoundAnimals;

    const frontIds = this.section().Content.AnimalIdsFront;
    const backIds = this.section().Content.AnimalIdsBack;

    const animalMap = new Map(allAnimals.map(a => [a.ID, a]));

    this.frontAnimals.length = 0;
    this.backAnimals.length = 0;
    this.middleAnimals.length = 0;

    for (const id of frontIds) {
      const animal = animalMap.get(id);
      if (animal) {
        this.frontAnimals.push(animal);
      }
    }

    for (const id of backIds) {
      const animal = animalMap.get(id);
      if (animal) {
        this.backAnimals.push(animal);
      }
    }

    const frontSet = new Set(frontIds);
    const backSet = new Set(backIds);

    for (const animal of allAnimals) {
      if (!frontSet.has(animal.ID) && !backSet.has(animal.ID)) {
        this.middleAnimals.push(animal);
      }
    }
  }

  protected drop(event: CdkDragDrop<CmsAnimal[]>) {
    const front = [...this.section().Content.AnimalIdsFront];
    const back = [...this.section().Content.AnimalIdsBack];

    const getIds = (list: string) => {
      switch (list) {
        case 'front':
          return front;
        case 'back':
          return back;
        default:
          return null;
      }
    };

    const source = getIds(event.previousContainer.id);
    const target = getIds(event.container.id);

    // Front -> Front
    if (source === front && target === front) {
      moveItemInArray(front, event.previousIndex, event.currentIndex);
    }

    // Back -> Back
    else if (source === back && target === back) {
      moveItemInArray(back, event.previousIndex, event.currentIndex);
    }

    // Front -> Back
    else if (source === front && target === back) {
      transferArrayItem(front, back, event.previousIndex, event.currentIndex);
    }

    // Back -> Front
    else if (source === back && target === front) {
      transferArrayItem(back, front, event.previousIndex, event.currentIndex);
    }

    // Middle -> Front
    else if (source === null && target === front) {
      const animal = event.previousContainer.data[event.previousIndex];
      front.splice(event.currentIndex, 0, animal.ID);
    }

    // Middle -> Back
    else if (source === null && target === back) {
      const animal = event.previousContainer.data[event.previousIndex];
      back.splice(event.currentIndex, 0, animal.ID);
    }

    // Front -> Middle
    else if (source === front && target === null) {
      front.splice(event.previousIndex, 1);
    }

    // Back -> Middle
    else if (source === back && target === null) {
      back.splice(event.previousIndex, 1);
    }

    this.section().Content.AnimalIdsFront = front;
    this.section().Content.AnimalIdsBack = back;
    this.rebuildLists();
    this.updateAnimals();
  }

  protected showExplanation() {
    this.alertService.openAlert('Reihefolge der Tierliste', 'In diesem Bereich kann die Reihenfolge der Liste geändert werden. Um Hunde explizit weiter vorne oder hinten anzuzeigen, können sie per drag & drop aus der mittleren Liste in die obere oder untere Liste gezogen werden. Dort können sie auch in beliebiger Reihenfolge angeordnet werden. Die Tiere in der mittleren liste werden automatisch nach dem letzten Änderungsdatum sortiert - zuletzt geänderte vorne.')
  }
}
