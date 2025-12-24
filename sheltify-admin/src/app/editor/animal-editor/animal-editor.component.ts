import { DatePipe } from '@angular/common';
import { Component, input, inject, output, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';
import { firstValueFrom, lastValueFrom, Subject } from 'rxjs';
import { CmsArticle } from 'sheltify-lib/article-types';
import { createEmptyArticle } from 'src/app/cms-types/cms-type.factory';
import { CmsAnimal, CmsTenantConfiguration } from 'sheltify-lib/cms-types';
import { ArticleEditorComponent } from 'src/app/editor/article-editor/article-editor.component';
import { CheckboxInputComponent } from 'src/app/forms/checkbox-input/checkbox-input.component';
import { DatePickerComponent } from 'src/app/forms/date-picker/date-picker.component';
import { ImagePickerSingleComponent } from 'src/app/forms/image-picker-single/image-picker-single.component';
import { NumberInputComponent } from 'src/app/forms/number-input/number-input.component';
import { RadioButtonsInputComponent } from 'src/app/forms/radio-buttons-input/radio-buttons-input.component';
import { SelectInputComponent } from 'src/app/forms/select-input/select-input.component';
import { AlertService } from 'src/app/services/alert.service';
import { AnimalService } from 'src/app/services/animal.service';
import { ModalService } from 'src/app/services/modal.service';
import { TenantConfigurationService } from 'src/app/services/tenant-configuration.service';
import { AnimalPickerDialogComponent } from 'src/app/ui/animal-picker-dialog/animal-picker-dialog.component';
import { LastEditedComponent } from 'src/app/ui/last-edited/last-edited.component';
import { TextInputComponent } from '../../forms/text-input/text-input.component';
import { CmsRequestService } from '../../services/cms-request.service';

@Component({
  selector: 'app-animal-editor',
  imports: [
    TextInputComponent,
    FormsModule,
    CheckboxInputComponent,
    ImagePickerSingleComponent,
    ArticleEditorComponent,
    DatePickerComponent,
    RadioButtonsInputComponent,
    NumberInputComponent,
    SelectInputComponent,
    LastEditedComponent,
  ],
  templateUrl: './animal-editor.component.html',
  styleUrl: './animal-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimalEditorComponent {

  private cmsRequestService = inject(CmsRequestService);

  animal = input<CmsAnimal | null>(null);
  animals = input.required<CmsAnimal[] | null>();
  saved = output<CmsAnimal | null>();
  deleted = output();

  saveArticle$ = new Subject<void>();

  constructor(
    public tenantConfigurationService: TenantConfigurationService,
    private modalService: ModalService,
    private animalService: AnimalService,
    private alertService: AlertService,
  ) {
  }

  animalKinds: string[] = [];

  async ngOnInit() {
    this.animalKinds = (await this.tenantConfigurationService.animalKinds());
  }

  async save() {
    const savedAnimal = await this.animalService.save(this.animal()!);

    if (savedAnimal) {
      this.saved.emit(savedAnimal!);
      this.saveArticle$.next();
    }
  }

  async togglePublished() {
    const savedAnimal = await this.animalService.togglePublished(this.animal()!);

    if (savedAnimal) {
      this.saved.emit(savedAnimal!);
      this.saveArticle$.next();
    }
  }

  protected async createArticle() {
    const article: CmsArticle = createEmptyArticle();
    const savedArticle = await firstValueFrom(this.cmsRequestService.saveArticle(article));
    this.animal()!.ArticleID = savedArticle.ID;
    this.save();
  }

  protected async assignExistingArticle() {
    const selectedAnimal = await this.modalService.openFinishable(AnimalPickerDialogComponent, {
      animals: this.animals()!
    });

    if (selectedAnimal) {
      this.animal()!.ArticleID = selectedAnimal.ArticleID;
      this.save();
    }
  }

  protected async delete() {
    const choice = await this.alertService.openAlert('Tier wirklich entfernen?', 'Aktion kann nicht rückgängig gemacht werden', ['ja', 'nein'])
    if (choice !== 'ja') return;

    await lastValueFrom(this.cmsRequestService.deleteAnimals([this.animal()!.ID]));
    this.deleted.emit();
  }
}
