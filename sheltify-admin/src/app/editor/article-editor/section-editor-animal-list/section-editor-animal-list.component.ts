import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Component, input, OnDestroy, OnInit, output, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RadioButtonsInputComponent } from '@app/forms/radio-buttons-input/radio-buttons-input.component';
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
    NgSelectComponent,
    NgOptionComponent,
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
    this.section().TempFoundAnimals = await firstValueFrom(this.cmsRequestService.getFilteredAnimals(this.section().Content));
    this.triggerRerender.emit();
  }

  ngOnDestroy() {
    this.updateSubscription?.unsubscribe();
  }

  protected drop($event: CdkDragDrop<CmsAnimal[], any>) {

  }
}
